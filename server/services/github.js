/**
 * GitHub API Service
 * Handles all communication with the GitHub REST API.
 * Includes in-memory caching (node-cache) and rate-limit awareness.
 */

const axios = require('axios');
const NodeCache = require('node-cache');

// Cache with 10-minute TTL
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Create an authenticated Axios instance for GitHub API.
 */
const ghApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  },
});

// ---------- Rate-limit helper ----------

let rateLimitRemaining = null;
let rateLimitReset = null;

ghApi.interceptors.response.use((response) => {
  rateLimitRemaining = parseInt(response.headers['x-ratelimit-remaining'], 10);
  rateLimitReset = parseInt(response.headers['x-ratelimit-reset'], 10);
  return response;
});

function checkRateLimit() {
  if (rateLimitRemaining !== null && rateLimitRemaining <= 5) {
    const resetDate = new Date(rateLimitReset * 1000);
    const err = new Error(
      `GitHub API rate limit nearly exhausted. Resets at ${resetDate.toISOString()}`
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
  const { data } = await ghApi.get(url, { params });
  cache.set(key, data);
  return data;
}

// ---------- Public API ----------

/** Fetch a GitHub user profile */
async function getUser(username) {
  return cachedGet(`/users/${username}`);
}

/** Fetch public repos for a user (up to 100) */
async function getUserRepos(username) {
  return cachedGet(`/users/${username}/repos`, {
    per_page: 100,
    sort: 'updated',
  });
}

/** Fetch repo metadata */
async function getRepoDetails(owner, repo) {
  return cachedGet(`/repos/${owner}/${repo}`);
}

/**
 * Fetch commits for a repo (paginated, up to 500).
 * Returns an array of commit objects.
 */
async function getCommits(owner, repo, maxPages = 5) {
  const cacheKey = `commits:${owner}/${repo}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  checkRateLimit();

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
      // If 409 (empty repo) just return empty
      if (err.response && err.response.status === 409) break;
      throw err;
    }
  }

  cache.set(cacheKey, allCommits);
  return allCommits;
}

/** Fetch contributors for a repo */
async function getContributors(owner, repo) {
  try {
    return await cachedGet(`/repos/${owner}/${repo}/contributors`, {
      per_page: 100,
    });
  } catch (err) {
    // Some repos (forks with no own commits) return 404
    if (err.response && err.response.status === 404) return [];
    throw err;
  }
}

/** Fetch language breakdown for a repo (bytes per language) */
async function getLanguages(owner, repo) {
  try {
    return await cachedGet(`/repos/${owner}/${repo}/languages`);
  } catch (err) {
    if (err.response && err.response.status === 404) return {};
    throw err;
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
