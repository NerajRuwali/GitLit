/**
 * API client for communicating with the GitLit backend.
 *
 * Features:
 *  - Centralized config (src/config/api.js)
 *  - Automatic retry with exponential backoff (handles Render cold starts)
 *  - Friendly error messages for network failures
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
 * Retries only on network-level failures (cold start, timeout), NOT on 4xx errors.
 */
async function withRetry(fn, retries = RETRY_CONFIG.maxRetries) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx) — only on network/server errors
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        throw error;
      }

      // If we have retries left, wait with exponential backoff
      if (attempt < retries) {
        const delay = RETRY_CONFIG.baseDelay * Math.pow(2, attempt);
        console.warn(
          `[GitLit] Request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms...`,
          error.message
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
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Server is waking up — please wait a moment and try again (Render free-tier cold start can take ~30s)';
  }
  if (error.response?.data) {
    const d = error.response.data;
    if (typeof d.error === 'string') return d.error;
    if (d.error?.message) return d.error.message;
    if (typeof d.message === 'string') return d.message;
  }
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
