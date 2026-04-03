/**
 * API Routes
 * Endpoints for user analysis, repo analysis, and repo comparison.
 */

const express = require('express');
const router = express.Router();
const github = require('../services/github');
const analytics = require('../services/analytics');

// ---------- GET /api/user/:username ----------
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const [user, repos] = await Promise.all([
      github.getUser(username),
      github.getUserRepos(username),
    ]);

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
        name: user.name,
        avatar: user.avatar_url,
        bio: user.bio,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        createdAt: user.created_at,
      },
      stats: {
        totalStars,
        totalForks,
        languages: Object.entries(languages)
          .sort(([, a], [, b]) => b - a)
          .map(([lang, count]) => ({ lang, count })),
      },
      repos: repos.slice(0, 30).map((r) => ({
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        updatedAt: r.updated_at,
        url: r.html_url,
      })),
      rateLimit: github.getRateLimitInfo(),
    });
  } catch (err) {
    console.error('GET /api/user error:', err.message);
    const status = err.status || err.response?.status || 500;
    res.status(status).json({
      error: status === 404 ? 'User not found' : err.message,
    });
  }
});

// ---------- GET /api/repo/:owner/:repo ----------
router.get('/repo/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const [details, commits, contributors, languages] = await Promise.all([
      github.getRepoDetails(owner, repo),
      github.getCommits(owner, repo),
      github.getContributors(owner, repo),
      github.getLanguages(owner, repo),
    ]);

    const perDay = analytics.commitsPerDay(commits);
    const dayEntries = Object.entries(perDay);
    const mostActiveDay = dayEntries.length
      ? dayEntries.reduce((best, cur) => (cur[1] > best[1] ? cur : best))[0]
      : null;
    const averageCommitsPerDay = dayEntries.length
      ? +(commits.length / dayEntries.length).toFixed(2)
      : 0;

    const analysis = {
      commitsPerDay: perDay,
      commitsPerWeek: analytics.commitsPerWeek(commits),
      commitsPerMonth: analytics.commitsPerMonth(commits),
      topContributors: analytics.topContributors(contributors),
      peakHours: analytics.peakHours(commits),
      heatmap: analytics.activityHeatmap(commits),
      streaks: analytics.contributionStreaks(commits),
      wordCloud: analytics.wordFrequency(commits),
      languages,           // { JavaScript: 123456, Python: 78901, ... }
      mostActiveDay,       // "2024-06-15"
      averageCommitsPerDay,// 2.34
    };

    res.json({
      repo: {
        fullName: details.full_name,
        description: details.description,
        stars: details.stargazers_count,
        forks: details.forks_count,
        watchers: details.watchers_count,
        openIssues: details.open_issues_count,
        language: details.language,
        createdAt: details.created_at,
        updatedAt: details.updated_at,
        url: details.html_url,
        defaultBranch: details.default_branch,
      },
      totalCommits: commits.length,
      totalContributors: contributors.length,
      analysis,
      rateLimit: github.getRateLimitInfo(),
    });
  } catch (err) {
    console.error('GET /api/repo error:', err.message);
    const status = err.status || err.response?.status || 500;
    res.status(status).json({
      error: status === 404 ? 'Repository not found' : err.message,
    });
  }
});

// ---------- GET /api/compare/:owner1/:repo1/:owner2/:repo2 ----------
router.get('/compare/:owner1/:repo1/:owner2/:repo2', async (req, res) => {
  try {
    const { owner1, repo1, owner2, repo2 } = req.params;

    // Fetch both repos in parallel
    const [res1, res2] = await Promise.all([
      fetchRepoData(owner1, repo1),
      fetchRepoData(owner2, repo2),
    ]);

    res.json({ repo1: res1, repo2: res2, rateLimit: github.getRateLimitInfo() });
  } catch (err) {
    console.error('GET /api/compare error:', err.message);
    const status = err.status || err.response?.status || 500;
    res.status(status).json({ error: err.message });
  }
});

/** Helper: fetch and analyze a single repo */
async function fetchRepoData(owner, repo) {
  const [details, commits, contributors] = await Promise.all([
    github.getRepoDetails(owner, repo),
    github.getCommits(owner, repo),
    github.getContributors(owner, repo),
  ]);

  return {
    repo: {
      fullName: details.full_name,
      description: details.description,
      stars: details.stargazers_count,
      forks: details.forks_count,
      language: details.language,
      url: details.html_url,
    },
    totalCommits: commits.length,
    totalContributors: contributors.length,
    analysis: {
      commitsPerMonth: analytics.commitsPerMonth(commits),
      topContributors: analytics.topContributors(contributors),
      peakHours: analytics.peakHours(commits),
      streaks: analytics.contributionStreaks(commits),
    },
  };
}

module.exports = router;
