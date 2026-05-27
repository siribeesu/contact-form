// server.js
// Main entry point for the She Can Foundation Express backend

require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Initialize Express app ───────────────────────────────────────────────────
const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet()); // Sets various HTTP security headers

// ─── CORS Configuration ───────────────────────────────────────────────────────
// Allow requests from frontend (Vite dev server and Vercel)
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'https://shecanfoundation.org',       // Real She Can Foundation website
      'https://www.shecanfoundation.org',   // www variant
      'https://she-can.vercel.app',         // Replace with your actual Vercel URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parser Middleware ───────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Accept JSON bodies (limit size)
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger (Development) ────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── General API Rate Limiting ────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Health Check Route ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌸 She Can Foundation API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy', uptime: process.uptime() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// ─── 404 & Error Handling ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server (Local) or Export for Vercel ──────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running locally in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📋 API Base URL: http://localhost:${PORT}/api`);
  });
}

// Export for serverless environments (Vercel)
module.exports = app;
