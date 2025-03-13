const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes')
const taskRoute = require('./routes/taskRoutes')
const taskReviewRoutes = require('./routes/ReviewAndFeedback/reviewRoutes')
const finalReportRoutes = require('./routes/ReviewAndFeedback/finalReviewRoutes')

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://bug-hunt-platform-4mjb.vercel.app',
    'https://bug-hunt-platform.vercel.app', 
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(bodyParser.json());

// Connect to Database
connectDB();

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

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel serverless functions
module.exports = app;
