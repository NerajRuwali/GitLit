/**
 * API client for communicating with the backend.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 45000, // Slightly increased timeout for complex analysis
});

export async function fetchUser(username) {
  try {
    const { data } = await api.get(`/user/${username}`);
    console.log('API RESPONSE [user]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [user/${username}]:`, error.response?.data || error.message);
    throw error;
  }
}

export async function fetchRepo(owner, repo) {
  try {
    const { data } = await api.get(`/repo/${owner}/${repo}`);
    console.log('API RESPONSE [repo]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [repo/${owner}/${repo}]:`, error.response?.data || error.message);
    throw error;
  }
}

export async function fetchCompare(owner1, repo1, owner2, repo2) {
  try {
    const { data } = await api.get(`/compare/${owner1}/${repo1}/${owner2}/${repo2}`);
    console.log('API RESPONSE [compare]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [compare]:`, error.response?.data || error.message);
    throw error;
  }
}
