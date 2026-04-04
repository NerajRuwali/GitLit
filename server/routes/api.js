/**
 * API Routes
 * Endpoints for user analysis, repo analysis, and repo comparison.
 *
 * SAFETY: Every route handler is wrapped in try-catch.
 *         On ANY error, a JSON response is ALWAYS returned — never a crash.
 */

const express = require('express');
const router = express.Router();
const github = require('../services/github');
const analytics = require('../services/analytics');

// ---------- GET /api/user/:username ----------
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    let user, repos;
    try {
      [user, repos] = await Promise.all([
        github.getUser(username),
        github.getUserRepos(username),
      ]);
    } catch (fetchErr) {
      const status = fetchErr.status || 500;
      const message = status === 404
        ? `User "${username}" not found on GitHub`
        : fetchErr.message || 'Failed to fetch user data from GitHub';
      return res.status(status).json({ error: message });
    }

    // Safety: ensure repos is always an array
    if (!Array.isArray(repos)) repos = [];

    // Aggregate stats across repos
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const languages = {};
    for (const r of repos) {
      if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
    }

    res.json({
      profile: {
        login: user.login,
        name: user.name || null,
        avatar: user.avatar_url || null,
        bio: user.bio || null,
        publicRepos: user.public_repos || 0,
        followers: user.followers || 0,
        following: user.following || 0,
        createdAt: user.created_at || null,
      },
      stats: {
        totalStars,
        totalForks,
        languages: Object.entries(languages)
          .sort(([, a], [, b]) => b - a)
          .map(([lang, count]) => ({ lang, count })),
      },
      repos: repos.slice(0, 30).map((r) => ({
        name: r.name || 'unknown',
        fullName: r.full_name || '',
        description: r.description || null,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language || null,
        updatedAt: r.updated_at || null,
        url: r.html_url || '',
      })),
      rateLimit: github.getRateLimitInfo(),
    });
  } catch (err) {
    console.error('GET /api/user UNHANDLED:', err.message, err.stack);
    res.status(500).json({
      error: 'Something went wrong while fetching user data',
      details: err.message,
    });
  }
});

// ---------- GET /api/repo/:owner/:repo ----------
router.get('/repo/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required' });
    }

    let details;
    try {
      details = await github.getRepoDetails(owner, repo);
    } catch (fetchErr) {
      const status = fetchErr.status || 500;
      const message = status === 404
        ? `Repository "${owner}/${repo}" not found on GitHub`
        : fetchErr.message || 'Failed to fetch repository details';
      return res.status(status).json({ error: message });
    }

    // These NEVER throw — they return [] or {} on failure
    const [commits, contributors, languages] = await Promise.all([
      github.getCommits(owner, repo),
      github.getContributors(owner, repo),
      github.getLanguages(owner, repo),
    ]);

    // Safety: ensure arrays
    const safeCommits = Array.isArray(commits) ? commits : [];
    const safeContributors = Array.isArray(contributors) ? contributors : [];
    const safeLanguages = (typeof languages === 'object' && languages !== null) ? languages : {};

    const perDay = analytics.commitsPerDay(safeCommits);
    const dayEntries = Object.entries(perDay);
    const mostActiveDay = dayEntries.length
      ? dayEntries.reduce((best, cur) => (cur[1] > best[1] ? cur : best))[0]
      : null;
    const averageCommitsPerDay = dayEntries.length
      ? +(safeCommits.length / dayEntries.length).toFixed(2)
      : 0;

    const analysis = {
      commitsPerDay: perDay,
      commitsPerWeek: analytics.commitsPerWeek(safeCommits),
      commitsPerMonth: analytics.commitsPerMonth(safeCommits),
      topContributors: analytics.topContributors(safeContributors),
      peakHours: analytics.peakHours(safeCommits),
      heatmap: analytics.activityHeatmap(safeCommits),
      streaks: analytics.contributionStreaks(safeCommits),
      wordCloud: analytics.wordFrequency(safeCommits),
      languages: safeLanguages,
      mostActiveDay,
      averageCommitsPerDay,
    };

    res.json({
      repo: {
        fullName: details.full_name || `${owner}/${repo}`,
        description: details.description || null,
        stars: details.stargazers_count || 0,
        forks: details.forks_count || 0,
        watchers: details.watchers_count || 0,
        openIssues: details.open_issues_count || 0,
        language: details.language || null,
        createdAt: details.created_at || null,
        updatedAt: details.updated_at || null,
        url: details.html_url || '',
        defaultBranch: details.default_branch || 'main',
      },
      totalCommits: safeCommits.length,
      totalContributors: safeContributors.length,
      analysis,
      rateLimit: github.getRateLimitInfo(),
    });
  } catch (err) {
    console.error('GET /api/repo UNHANDLED:', err.message, err.stack);
    res.status(500).json({
      error: 'Something went wrong while fetching repository data',
      details: err.message,
    });
  }
});

// ---------- GET /api/compare/:owner1/:repo1/:owner2/:repo2 ----------
router.get('/compare/:owner1/:repo1/:owner2/:repo2', async (req, res) => {
  try {
    const { owner1, repo1, owner2, repo2 } = req.params;

    const [res1, res2] = await Promise.all([
      fetchRepoData(owner1, repo1),
      fetchRepoData(owner2, repo2),
    ]);

    res.json({ repo1: res1, repo2: res2, rateLimit: github.getRateLimitInfo() });
  } catch (err) {
    console.error('GET /api/compare UNHANDLED:', err.message);
    const status = err.status || 500;
    res.status(status).json({
      error: err.message || 'Comparison failed',
      details: err.message,
    });
  }
});

/** Helper: fetch and analyze a single repo — safe, never crashes */
async function fetchRepoData(owner, repo) {
  try {
    const [details, commits, contributors] = await Promise.all([
      github.getRepoDetails(owner, repo),
      github.getCommits(owner, repo),
      github.getContributors(owner, repo),
    ]);

    const safeCommits = Array.isArray(commits) ? commits : [];
    const safeContributors = Array.isArray(contributors) ? contributors : [];

    return {
      repo: {
        fullName: details.full_name || `${owner}/${repo}`,
        description: details.description || null,
        stars: details.stargazers_count || 0,
        forks: details.forks_count || 0,
        language: details.language || null,
        url: details.html_url || '',
      },
      totalCommits: safeCommits.length,
      totalContributors: safeContributors.length,
      analysis: {
        commitsPerMonth: analytics.commitsPerMonth(safeCommits),
        topContributors: analytics.topContributors(safeContributors),
        peakHours: analytics.peakHours(safeCommits),
        streaks: analytics.contributionStreaks(safeCommits),
      },
    };
  } catch (err) {
    console.error(`fetchRepoData("${owner}/${repo}") failed:`, err.message);
    throw err;
  }
}

module.exports = router;
