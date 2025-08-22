// Migration script to update existing users with new follower structure
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const migrateUsers = async () => {
    try {
        console.log('Starting user migration...');
        
        // Update all users to have the new follower structure
        const result = await mongoose.connection.db.collection('users').updateMany(
            {},
            {
                $unset: {
                    // Remove old numeric fields if they exist as numbers
                    followers: "",
                    following: ""
                },
                $set: {
                    // Add new array fields and count fields
                    followers: [],
                    following: [],
                    followerCount: 0,
                    followingCount: 0
                }
            }
        );
        
        console.log(`Migration completed. Updated ${result.modifiedCount} users.`);
        
    } catch (error) {
        console.error('Migration error:', error);
    }
};

const runMigration = async () => {
    await connectDB();
    await migrateUsers();
    await mongoose.disconnect();
    console.log('Migration script finished');
    process.exit(0);
};

runMigration();
