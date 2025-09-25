const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Atlas connected successfully');
        console.log('Database name:', mongoose.connection.db.databaseName);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;