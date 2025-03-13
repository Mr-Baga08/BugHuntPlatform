const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Suitable for serverless
            maxPoolSize: 10 // Limit the number of connections
        });
        
        console.log('MongoDB connected');
        cachedConnection = connection;
        return connection;
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        // Don't exit process on serverless functions
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};

module.exports = connectDB;
