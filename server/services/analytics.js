/**
 * Analytics Service
 * Pure functions that compute stats from raw GitHub API data.
 */

/**
 * Group commits by day → { "2024-01-15": 3, ... }
 */
function commitsPerDay(commits) {
  const map = {};
  for (const c of commits) {
    const date = (c.commit?.author?.date || '').slice(0, 10);
    if (!date) continue;
    map[date] = (map[date] || 0) + 1;
  }
  // Sort by date
  return Object.fromEntries(
    Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  );
}

/**
 * Group commits by ISO week → { "2024-W03": 12, ... }
 */
function commitsPerWeek(commits) {
  const map = {};
  for (const c of commits) {
    const dateStr = c.commit?.author?.date;
    if (!dateStr) continue;
    const d = new Date(dateStr);
    const year = d.getFullYear();
    // ISO week number
    const jan1 = new Date(year, 0, 1);
    const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    const key = `${year}-W${String(week).padStart(2, '0')}`;
    map[key] = (map[key] || 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  );
}

/**
 * Group commits by month → { "2024-01": 42, ... }
 */
function commitsPerMonth(commits) {
  const map = {};
  for (const c of commits) {
    const date = (c.commit?.author?.date || '').slice(0, 7);
    if (!date) continue;
    map[date] = (map[date] || 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  );
}

/**
 * Top contributors sorted by total contributions.
 * Input: GitHub contributors array from API.
 */
function topContributors(contributors) {
  return [...contributors]
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 15)
    .map((c) => ({
      login: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
    }));
}

/**
 * Peak activity hours → Array of 24 values (index = hour UTC).
 */
function peakHours(commits) {
  const hours = new Array(24).fill(0);
  for (const c of commits) {
    const dateStr = c.commit?.author?.date;
    if (!dateStr) continue;
    const h = new Date(dateStr).getUTCHours();
    hours[h]++;
  }
  return hours;
}

/**
 * Activity heatmap data: 7 (days) × 24 (hours).
 * Returns { grid: number[][], days: string[], hours: number[] }
 */
function activityHeatmap(commits) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // grid[day][hour] = count
  const grid = Array.from({ length: 7 }, () => new Array(24).fill(0));

  for (const c of commits) {
    const dateStr = c.commit?.author?.date;
    if (!dateStr) continue;
    const d = new Date(dateStr);
    grid[d.getUTCDay()][d.getUTCHours()]++;
  }

  return { grid, days: dayNames, hours: Array.from({ length: 24 }, (_, i) => i) };
}

/**
 * Contribution streaks.
 * Returns { current, longest } streak lengths (in days).
 */
function contributionStreaks(commits) {
  if (!commits.length) return { current: 0, longest: 0 };

  const days = new Set();
  for (const c of commits) {
    const date = (c.commit?.author?.date || '').slice(0, 10);
    if (date) days.add(date);
  }

  const sorted = [...days].sort();
  let longest = 1;
  let current = 1;
  let streakLengths = [1];

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const cur = new Date(sorted[i]);
    const diffDays = (cur - prev) / 86400000;

    if (diffDays === 1) {
      current++;
    } else {
      streakLengths.push(current);
      current = 1;
    }
    if (current > longest) longest = current;
  }
  streakLengths.push(current);

  // Current streak: check if the latest commit day is today or yesterday
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const latestDay = sorted[sorted.length - 1];
  const currentStreak =
    latestDay === today || latestDay === yesterday ? current : 0;

  return { current: currentStreak, longest };
}

/**
 * Word frequency from commit messages.
 * Returns top 80 words as [{ text, value }].
 */
function wordFrequency(commits) {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about', 'between',
    'through', 'after', 'before', 'above', 'below', 'up', 'out', 'off',
    'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but',
    'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each',
    'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because',
    'this', 'that', 'these', 'those', 'it', 'its', 'i', 'we', 'they',
    'he', 'she', 'my', 'your', 'his', 'her', 'our', 'their', 'what',
    'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'if',
  ]);

  const freq = {};
  for (const c of commits) {
    const msg = c.commit?.message || '';
    const words = msg.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    for (const w of words) {
      if (w.length < 3 || stopWords.has(w)) continue;
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 80)
    .map(([text, value]) => ({ text, value }));
}

module.exports = {
  commitsPerDay,
  commitsPerWeek,
  commitsPerMonth,
  topContributors,
  peakHours,
  activityHeatmap,
  contributionStreaks,
  wordFrequency,
};
