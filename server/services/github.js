/**
 * GitHub API Service
 * Handles all communication with the GitHub REST API.
 * Includes in-memory caching (node-cache) and rate-limit awareness.
 *
 * SAFETY: Every public function is wrapped so it NEVER throws an
 *         unhandled error — always returns fallback data on failure.
 */

const axios = require('axios');
const NodeCache = require('node-cache');

// Cache with 10-minute TTL
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Create an authenticated Axios instance for GitHub API.
 * If GITHUB_TOKEN is missing the requests still work (lower rate limit).
 */
const ghApi = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 30000, // 30s timeout to avoid hanging requests
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  },
});

if (!process.env.GITHUB_TOKEN) {
  console.warn('⚠️  GITHUB_TOKEN not set — API rate limit will be 60 req/hr (unauthenticated)');
}

// ---------- Rate-limit helper ----------

let rateLimitRemaining = null;
let rateLimitReset = null;

ghApi.interceptors.response.use(
  (response) => {
    rateLimitRemaining = parseInt(response.headers['x-ratelimit-remaining'], 10);
    rateLimitReset = parseInt(response.headers['x-ratelimit-reset'], 10);
    return response;
  },
  (error) => {
    // Still capture rate limit headers on error responses
    if (error.response?.headers) {
      const rem = error.response.headers['x-ratelimit-remaining'];
      const rst = error.response.headers['x-ratelimit-reset'];
      if (rem !== undefined) rateLimitRemaining = parseInt(rem, 10);
      if (rst !== undefined) rateLimitReset = parseInt(rst, 10);
    }
    return Promise.reject(error);
  }
);

/**
 * Check rate limit — throws a descriptive error if exhausted.
 * Returns silently if rate limit is fine or unknown.
 */
function checkRateLimit() {
  if (rateLimitRemaining !== null && rateLimitRemaining <= 2) {
    const resetDate = new Date((rateLimitReset || 0) * 1000);
    const err = new Error(
      `GitHub API rate limit exhausted. Resets at ${resetDate.toISOString()}`
    );
    err.status = 429;
    throw err;
  }
}

// ---------- Cached GET helper ----------

async function cachedGet(url, params = {}) {
  const key = `${url}?${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  checkRateLimit();

  try {
    const { data } = await ghApi.get(url, { params });
    cache.set(key, data);
    return data;
  } catch (err) {
    // Build a clean error with the right status code
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message ||
      err.message ||
      'GitHub API request failed';

    const cleanErr = new Error(message);
    cleanErr.status = status;
    throw cleanErr;
  }
}

// ---------- Public API ----------

/** Fetch a GitHub user profile */
async function getUser(username) {
  try {
    return await cachedGet(`/users/${username}`);
  } catch (err) {
    console.error(`[github] getUser("${username}") failed:`, err.message);
    throw err;
  }
}

/** Fetch public repos for a user (up to 100) */
async function getUserRepos(username) {
  try {
    return await cachedGet(`/users/${username}/repos`, {
      per_page: 100,
      sort: 'updated',
    });
  } catch (err) {
    console.error(`[github] getUserRepos("${username}") failed:`, err.message);
    // Return empty array so route handler still has something to work with
    if (err.status === 404) throw err;
    return [];
  }
}

/** Fetch repo metadata */
async function getRepoDetails(owner, repo) {
  try {
    return await cachedGet(`/repos/${owner}/${repo}`);
  } catch (err) {
    console.error(`[github] getRepoDetails("${owner}/${repo}") failed:`, err.message);
    throw err;
  }
}

/**
 * Fetch commits for a repo (paginated, up to 500).
 * Returns an array of commit objects. Never throws — returns [] on failure.
 */
async function getCommits(owner, repo, maxPages = 5) {
  const cacheKey = `commits:${owner}/${repo}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  try {
    checkRateLimit();
  } catch (err) {
    console.error(`[github] getCommits rate-limited:`, err.message);
    return [];
  }

  let allCommits = [];
  for (let page = 1; page <= maxPages; page++) {
    try {
      const { data } = await ghApi.get(`/repos/${owner}/${repo}/commits`, {
        params: { per_page: 100, page },
      });
      if (!data || data.length === 0) break;
      allCommits = allCommits.concat(data);
      if (data.length < 100) break; // last page
    } catch (err) {
      // 409 = empty repo, 404 = not found — just return what we have
      if (err.response && (err.response.status === 409 || err.response.status === 404)) break;
      console.error(`[github] getCommits page ${page} failed:`, err.message);
      break; // Return partial results instead of crashing
    }
  }

  cache.set(cacheKey, allCommits);
  return allCommits;
}

/** Fetch contributors for a repo — returns [] on any failure */
async function getContributors(owner, repo) {
  try {
    return await cachedGet(`/repos/${owner}/${repo}/contributors`, {
      per_page: 100,
    });
  } catch (err) {
    console.error(`[github] getContributors("${owner}/${repo}") failed:`, err.message);
    return [];
  }
}

/** Fetch language breakdown for a repo — returns {} on any failure */
async function getLanguages(owner, repo) {
  try {
    return await cachedGet(`/repos/${owner}/${repo}/languages`);
  } catch (err) {
    console.error(`[github] getLanguages("${owner}/${repo}") failed:`, err.message);
    return {};
  }
}

/** Get current rate limit info */
function getRateLimitInfo() {
  return { remaining: rateLimitRemaining, reset: rateLimitReset };
}

module.exports = {
  getUser,
  getUserRepos,
  getRepoDetails,
  getCommits,
  getContributors,
  getLanguages,
  getRateLimitInfo,
};
