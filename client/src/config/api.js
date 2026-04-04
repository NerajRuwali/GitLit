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
export const REQUEST_TIMEOUT = 60_000;

// Retry configuration for cold-start resilience
export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 2000, // ms — doubles on each retry (2s, 4s, 8s)
};
