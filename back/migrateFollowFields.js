const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function migrateFollowFields() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        // First, fix any users where followers/following are numbers instead of arrays
        console.log('Fixing data type conflicts...');
        
        // Fix followers field that might be integers
        const followersTypeResult = await User.updateMany(
            { followers: { $type: "number" } },
            { $set: { followers: [] } }
        );
        console.log(`Fixed ${followersTypeResult.modifiedCount} users with incorrect followers type`);

        // Fix following field that might be integers
        const followingTypeResult = await User.updateMany(
            { following: { $type: "number" } },
            { $set: { following: [] } }
        );
        console.log(`Fixed ${followingTypeResult.modifiedCount} users with incorrect following type`);

        // Now update all users to have proper follow fields if they don't exist
        console.log('Adding missing follow fields...');
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

        console.log(`Updated ${result.modifiedCount} users with missing follow fields`);

        // Also ensure that existing followingCount and followerCount match array lengths
        console.log('Synchronizing follow counts...');
        const users = await User.find({});
        let syncCount = 0;
        
        for (const user of users) {
            const followersCount = Array.isArray(user.followers) ? user.followers.length : 0;
            const followingCount = Array.isArray(user.following) ? user.following.length : 0;
            
            if (user.followerCount !== followersCount || user.followingCount !== followingCount) {
                await User.findByIdAndUpdate(user._id, {
                    followerCount: followersCount,
                    followingCount: followingCount
                });
                syncCount++;
            }
        }
        
        console.log(`Synchronized counts for ${syncCount} users`);

        console.log('Migration completed successfully');
        return {
            success: true,
            message: 'Migration completed successfully',
            stats: {
                followersTypeFixed: followersTypeResult.modifiedCount,
                followingTypeFixed: followingTypeResult.modifiedCount,
                missingFieldsAdded: result.modifiedCount,
                countsSynchronized: syncCount
            }
        };

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateFollowFields()
        .then(() => {
            console.log('Migration completed, closing connection...');
            mongoose.connection.close();
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            mongoose.connection.close();
            process.exit(1);
        });
}

module.exports = migrateFollowFields;
