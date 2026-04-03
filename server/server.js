/**
 * GitHub Contribution Visualizer — Express Server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const aiRoutes = require('./routes/ai');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);
app.use('/api', aiRoutes);

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'GitHub Contribution Visualizer API' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Start server with port conflict handling.
 * Falls back to next available port if EADDRINUSE occurs.
 */
const PREFERRED_PORT = parseInt(process.env.PORT, 10) || 5001;
const MAX_PORT_RETRIES = 5;

function startServer(port, retries = 0) {
  const server = app.listen(port)
    .on('listening', () => {
      console.log(`\nServer is running on http://localhost:${port}`);
      console.log(
        process.env.GITHUB_TOKEN
          ? 'GitHub token loaded (authenticated — 5000 req/hr)'
          : 'No GITHUB_TOKEN configured — unauthenticated requests (60 req/hr limit)'
      );
      console.log('Ready to accept requests\n');
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is in use.`);
        if (retries < MAX_PORT_RETRIES) {
          const nextPort = port + 1;
          console.log(`Trying port ${nextPort}...`);
          startServer(nextPort, retries + 1);
        } else {
          console.error(`Could not find an available port after ${MAX_PORT_RETRIES} retries.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err.message);
        process.exit(1);
      }
    });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
    // Force exit after 5s if connections don't close
    setTimeout(() => process.exit(1), 5000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer(PREFERRED_PORT);
