const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/auth');
const dotenv = require('dotenv');
// const expressFormidable = require("express-formidable")
const adminRoutes = require('./routes/adminRoutes')
const taskRoute = require('./routes/taskRoutes')
const taskReviewRoutes = require('./routes/ReviewAndFeedback/reviewRoutes')
const finalReportRoutes = require('./routes/ReviewAndFeedback/finalReviewRoutes')

// const expressFormidable = require("express-formidable")
dotenv.config();

const app = express();
// app.use(expressFormidable())
app.use(express.json());
// app.use()
app.use(cors());
connectDB();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/task", taskRoute);
app.use("/api/taskReview", taskReviewRoutes);
app.use("/api/finalReport", finalReportRoutes);

app.use("/",(req,res)=>{
    // console.log("Connected to backend...")
}); 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});