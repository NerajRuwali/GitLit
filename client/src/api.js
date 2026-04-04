/**
 * API client for communicating with the GitLit backend.
 *
 * Features:
 *  - Centralized config (src/config/api.js)
 *  - Retry with backoff ONLY for network failures (cold start, timeout)
 *  - Does NOT retry on server errors (4xx, 5xx) — those are real errors
 *  - Friendly error messages for all failure modes
 */
import axios from 'axios';
import { API_BASE, REQUEST_TIMEOUT, RETRY_CONFIG } from './config/api';

// Debug: log the resolved API base URL on startup
console.log('[GitLit] API base URL:', API_BASE || '(proxy / relative)');

const api = axios.create({
  baseURL: API_BASE,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
});

// ─── Retry Helper ─────────────────────────────────────────────────────────────

/**
 * Execute an async function with retries and exponential backoff.
 * ONLY retries on true network failures (no response received at all).
 * Does NOT retry on 4xx or 5xx — the server answered, just with an error.
 */
async function withRetry(fn, retries = RETRY_CONFIG.maxRetries) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If the server actually responded (ANY status code), don't retry —
      // the server is alive, it just returned an error.
      if (error.response) {
        throw error;
      }

      // Only retry on true network-level failures (no response at all):
      // ERR_NETWORK, ECONNABORTED (timeout), ECONNREFUSED, etc.
      if (attempt < retries) {
        const delay = RETRY_CONFIG.baseDelay * Math.pow(2, attempt);
        console.warn(
          `[GitLit] Network failure (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms...`,
          error.code || error.message
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert Axios errors into friendly, user-facing messages.
 */
function friendlyError(error) {
  // Network-level failure — server didn't respond at all
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. The server may be starting up — please try again in a moment.';
    }
    return 'Could not reach the server. It may be starting up — please try again in ~30 seconds.';
  }

  // Server responded with an error
  const status = error.response.status;
  const d = error.response.data;

  // Extract the error message from response body
  if (d) {
    if (typeof d.error === 'string') return d.error;
    if (d.error?.message) return d.error.message;
    if (typeof d.message === 'string') return d.message;
    if (typeof d.details === 'string') return d.details;
  }

  // Fallback based on status code
  if (status === 404) return 'Not found. Please check the username or repository name.';
  if (status === 429) return 'GitHub API rate limit exceeded. Please wait a few minutes and try again.';
  if (status >= 500) return 'Server error occurred. Please try again.';

  return error.message || 'An unknown error occurred';
}

// ─── Exported Fetchers ────────────────────────────────────────────────────────

export async function fetchUser(username) {
  try {
    const { data } = await withRetry(() => api.get(`/user/${username}`));
    console.log('API RESPONSE [user]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [user/${username}]:`, error.response?.data || error.message);
    throw new Error(friendlyError(error));
  }
}

export async function fetchRepo(owner, repo) {
  try {
    const { data } = await withRetry(() => api.get(`/repo/${owner}/${repo}`));
    console.log('API RESPONSE [repo]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [repo/${owner}/${repo}]:`, error.response?.data || error.message);
    throw new Error(friendlyError(error));
  }
}

export async function fetchCompare(owner1, repo1, owner2, repo2) {
  try {
    const { data } = await withRetry(() => api.get(`/compare/${owner1}/${repo1}/${owner2}/${repo2}`));
    console.log('API RESPONSE [compare]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [compare]:`, error.response?.data || error.message);
    throw new Error(friendlyError(error));
  }
}

export default api;
