# GitHub Contribution Visualizer

A full-stack web application that analyzes GitHub repositories and visualizes contribution patterns, commit frequency, developer activity, and repository insights.

## 🚀 Features

- **User Analysis** — Enter a GitHub username to see profile stats, languages, and repositories
- **Repository Analysis** — Deep-dive into any repo with commit timelines, contributor charts, heatmaps, and word clouds
- **Compare Repos** — Side-by-side comparison of two repositories
- **Dark/Light Mode** — Beautiful UI with smooth theme toggle
- **Export Charts** — Download any chart as a PNG image
- **Rate-limit Aware** — In-memory caching + GitHub API rate-limit handling

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4 |
| Charts | Chart.js, react-chartjs-2, d3-cloud |
| Backend | Node.js, Express |
| API | GitHub REST API v3 |
| Caching | node-cache (10 min TTL) |

## 📦 Setup

### Prerequisites
- Node.js ≥ 18
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (recommended for higher rate limits)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd "Github contribution visualizer"
```

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env and add your GITHUB_TOKEN
npm install
npm run dev
```

The server starts at `http://localhost:5000`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

The client starts at `http://localhost:5173` and proxies `/api` requests to the backend.

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GITHUB_TOKEN` | GitHub Personal Access Token | Recommended |
| `PORT` | Backend port (default: 5000) | No |

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/:username` | User profile, repos & stats |
| GET | `/api/repo/:owner/:repo` | Repo analysis with charts data |
| GET | `/api/compare/:o1/:r1/:o2/:r2` | Compare two repos |

## 📁 Project Structure

```
├── server/
│   ├── server.js            # Express entry point
│   ├── routes/api.js        # REST endpoints
│   ├── services/github.js   # GitHub API client + caching
│   ├── services/analytics.js# Data analysis functions
│   ├── .env.example
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.jsx          # Main application
│   │   ├── api.js           # API client
│   │   ├── index.css        # Global styles + themes
│   │   ├── hooks/useDebounce.js
│   │   └── components/
│   │       ├── SearchBar.jsx
│   │       ├── Dashboard.jsx
│   │       ├── CompareView.jsx
│   │       └── charts/
│   │           ├── CommitTimeline.jsx
│   │           ├── TopContributors.jsx
│   │           ├── ContributionPie.jsx
│   │           ├── ContributionHeatmap.jsx
│   │           └── WordCloud.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── .gitignore
```
