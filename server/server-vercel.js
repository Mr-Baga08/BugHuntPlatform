const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const taskRoute = require('./routes/taskRoutes');
const taskReviewRoutes = require('./routes/ReviewAndFeedback/reviewRoutes');
const finalReportRoutes = require('./routes/ReviewAndFeedback/finalReviewRoutes');
const { initBucket } = require('./config/cloudStorage'); // Import the cloud storage module

dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://bug-hunt-platform-4mjb.vercel.app',
    'https://bug-hunt-platform.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Enable OPTIONS preflight for all routes
app.options('*', cors(corsOptions));

// Enable CORS with the options
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(bodyParser.json());

// Database middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error' });
  }
});

// Initialize GridFS bucket if available
if (initBucket) {
  app.use(initBucket);
}

// Routes
app.use('/api/auth', userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/task", taskRoute);
app.use("/api/taskReview", taskReviewRoutes);
app.use("/api/finalReport", finalReportRoutes);

// Base route
app.get('/api', (req, res) => {
  res.json({ message: 'Bug Dashboard API is running' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel serverless functions
module.exports = app;
