const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
// Other imports...

const app = express();

// Important: CORS handling must come BEFORE other middleware
// Handle preflight OPTIONS requests with highest priority
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://bug-hunt-platform-4mjb.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Standard middleware
app.use(express.json());
app.use(bodyParser.json());

// Connect to database - with proper error handling for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ message: 'Database connection error' });
  }
});

// Routes with proper prefixes
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/task', taskRoute);
app.use('/api/taskReview', taskReviewRoutes);
app.use('/api/finalReport', finalReportRoutes);

// Root route for health check
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'production' ? null : err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless
module.exports = app;
