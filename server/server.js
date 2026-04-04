/**
 * GitHub Contribution Visualizer — Express Server
 * Production-ready for Render deployment.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ─── Graceful require: fail with clear message instead of crash ───────────────
let apiRoutes, aiRoutes;
try {
  apiRoutes = require('./routes/api');
} catch (err) {
  console.error('❌ Failed to load API routes:', err.message);
  apiRoutes = require('express').Router();
  apiRoutes.all('*', (_req, res) => res.status(500).json({ error: 'API routes failed to load' }));
}

try {
  aiRoutes = require('./routes/ai');
} catch (err) {
  console.error('❌ Failed to load AI routes:', err.message);
  aiRoutes = require('express').Router();
  aiRoutes.all('*', (_req, res) => res.status(500).json({ error: 'AI routes failed to load' }));
}

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS Configuration ───────────────────────────────────────────────────────
const allowedOrigins = [
  'https://git-lit.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// ─── Request Logger (lightweight, production-safe) ────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} — origin: ${req.headers.origin || 'none'}`);
  next();
});

// ─── Root Route (confirms server is alive) ────────────────────────────────────
app.get('/', (_req, res) => {
  res.send('GitLit Backend Running ✅');
});

// ─── Health Check Endpoint ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'GitLit API is active',
    environment: process.env.NODE_ENV || 'development',
    githubToken: process.env.GITHUB_TOKEN ? 'configured' : 'missing',
    openaiKey: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
  });
});

// ─── Test Endpoint ────────────────────────────────────────────────────────────
app.get('/api/test', (_req, res) => {
  res.json({ message: 'Backend working', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);
app.use('/api', aiRoutes);

// ─── 404 Handler (catch unmatched routes) ─────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    error: 'Route not found',
    status: 404,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  const statusCode = err.status || 500;
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} >> ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : err.message,
    status: 'error',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🚀 GitLit Server running on port ${PORT}`);
  console.log(`📡 GitHub Token: ${process.env.GITHUB_TOKEN ? 'Loaded (Authenticated)' : 'Not Loaded (Unauthenticated — rate limits apply)'}`);
  console.log(`🤖 OpenAI Key: ${process.env.OPENAI_API_KEY ? 'Loaded' : 'Not Loaded (AI insights will use fallback)'}`);
  console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(`✨ Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// ─── Unhandled Rejection / Exception Safety Nets ──────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  console.error(err.stack);
  // Allow time for logging before exit
  setTimeout(() => process.exit(1), 1000);
});
