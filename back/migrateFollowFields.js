const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function migrateFollowFields() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        // Update all users to have following and followers arrays if they don't exist
        const result = await User.updateMany(
            {
                $or: [
                    { following: { $exists: false } },
                    { followers: { $exists: false } },
                    { followingCount: { $exists: false } },
                    { followerCount: { $exists: false } }
                ]
            },
            {
                $set: {
                    following: [],
                    followers: [],
                    followingCount: 0,
                    followerCount: 0
                }
            }
        );

        console.log(`Updated ${result.modifiedCount} users with follow fields`);

        // Close connection
        await mongoose.connection.close();
        console.log('Migration completed successfully');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateFollowFields();
}

module.exports = migrateFollowFields;
