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

dotenv.config();

const app = express();

// Basic CORS configuration for all routes
app.use(cors({
    origin: ['https://bug-hunt-platform-4mjb.vercel.app', 'https://bug-hunt-platform.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Specific OPTIONS handler for the auth login endpoint
app.options('/api/auth/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://bug-hunt-platform-4mjb.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).end(); // Respond with no content (204) for OPTIONS
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/task", taskRoute);
app.use("/api/taskReview", taskReviewRoutes);
app.use("/api/finalReport", finalReportRoutes);

// Root route for checking if server is running
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
