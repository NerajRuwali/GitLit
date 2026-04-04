/**
 * Centralized API configuration for GitLit frontend.
 *
 * In production (Vercel):  VITE_API_URL = "https://gitlit.onrender.com"
 * In development:          VITE_API_URL is empty; Vite proxy handles /api → localhost
 */

export const BASE_URL = import.meta.env.VITE_API_URL || '';

// Full API base — all axios/fetch calls should use this as the root
export const API_BASE = `${BASE_URL}/api`;

// Render free tier spins down after 15 min of inactivity.
// First cold-start request can take 30–60 s.
export const REQUEST_TIMEOUT = 45_000;

// Retry configuration — LIMITED to prevent infinite-feeling loops
export const RETRY_CONFIG = {
  maxRetries: 2,      // Total attempts = 3 (initial + 2 retries)
  baseDelay: 3000,    // ms — 3s, then 6s
};
