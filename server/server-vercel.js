const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');  // Fixed: renamed to authRoutes to match file
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const taskRoute = require('./routes/taskRoutes');
const taskReviewRoutes = require('./routes/ReviewAndFeedback/reviewRoutes');
const finalReportRoutes = require('./routes/ReviewAndFeedback/finalReviewRoutes');

dotenv.config();

const app = express();

// CRITICAL: Handle preflight requests properly
// This middleware must come BEFORE any route definitions
app.use((req, res, next) => {
  // Always set these headers for all responses
  res.header('Access-Control-Allow-Origin', 'https://bug-hunt-platform-4mjb.vercel.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS method - respond immediately with 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Regular middleware
app.use(express.json());
app.use(bodyParser.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);  // Fixed: use authRoutes instead of userRoutes
app.use("/api/admin", adminRoutes);
app.use("/api/task", taskRoute);
app.use("/api/taskReview", taskReviewRoutes);
app.use("/api/finalReport", finalReportRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
