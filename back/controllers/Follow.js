const User = require("../models/User");

// Follow a user
exports.followUser = async (req, res) => {
    try {
        const { userIdToFollow } = req.params;
        const currentUserId = req.user._id; // Fixed: use _id instead of id

        // Validate userIdToFollow format
        if (!userIdToFollow.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        // Prevent self-following
        if (currentUserId.toString() === userIdToFollow) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        // Check if users exist
        const [currentUser, userToFollow] = await Promise.all([
            User.findById(currentUserId),
            User.findById(userIdToFollow)
        ]);

        if (!currentUser || !userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Initialize following array if it doesn't exist
        if (!currentUser.following) {
            currentUser.following = [];
        }

        // Check if already following - convert ObjectIds to strings for comparison
        const followingStrings = currentUser.following.map(id => id.toString());
        if (followingStrings.includes(userIdToFollow)) {
            return res.status(400).json({
                success: false,
                message: "You are already following this user"
            });
        }

        // Add to following/followers arrays and update counts
        await Promise.all([
            User.findByIdAndUpdate(
                currentUserId,
                {
                    $push: { following: userIdToFollow },
                    $inc: { followingCount: 1 }
                }
            ),
            User.findByIdAndUpdate(
                userIdToFollow,
                {
                    $push: { followers: currentUserId },
                    $inc: { followerCount: 1 }
                }
            )
        ]);

        return res.status(200).json({
            success: true,
            message: "Successfully followed user",
            data: {
                isFollowing: true,
                followersCount: userToFollow.followerCount + 1
            }
        });

    } catch (error) {
        console.error("Follow user error:", error);
        return res.status(500).json({
            success: false,
            message: "Error following user"
        });
    }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    try {
        const { userIdToUnfollow } = req.params;
        const currentUserId = req.user._id; // Fixed: use _id instead of id

        // Validate userIdToUnfollow format
        if (!userIdToUnfollow.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        // Check if users exist
        const [currentUser, userToUnfollow] = await Promise.all([
            User.findById(currentUserId),
            User.findById(userIdToUnfollow)
        ]);

        if (!currentUser || !userToUnfollow) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Initialize following array if it doesn't exist
        if (!currentUser.following) {
            currentUser.following = [];
        }

        // Check if currently following - convert ObjectIds to strings for comparison
        const followingStrings = currentUser.following.map(id => id.toString());
        if (!followingStrings.includes(userIdToUnfollow)) {
            return res.status(400).json({
                success: false,
                message: "You are not following this user"
            });
        }

        // Remove from following/followers arrays and update counts
        await Promise.all([
            User.findByIdAndUpdate(
                currentUserId,
                {
                    $pull: { following: userIdToUnfollow },
                    $inc: { followingCount: -1 }
                }
            ),
            User.findByIdAndUpdate(
                userIdToUnfollow,
                {
                    $pull: { followers: currentUserId },
                    $inc: { followerCount: -1 }
                }
            )
        ]);

        return res.status(200).json({
            success: true,
            message: "Successfully unfollowed user",
            data: {
                isFollowing: false,
                followersCount: userToUnfollow.followerCount - 1
            }
        });

    } catch (error) {
        console.error("Unfollow user error:", error);
        return res.status(500).json({
            success: false,
            message: "Error unfollowing user"
        });
    }
};

// Get follow status
exports.getFollowStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id; // Fixed: use _id instead of id
        console.log("Checking follow status for userId:", userId);
        console.log("Current user ID:", currentUserId);

        // Validate userId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const currentUser = await User.findById(currentUserId);
        
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Current user not found"
            });
        }

        // Initialize following array if it doesn't exist
        if (!currentUser.following) {
            currentUser.following = [];
        }

        // Convert following array to strings for comparison
        const followingStrings = currentUser.following.map(id => id.toString());
        const isFollowing = followingStrings.includes(userId);
        
        console.log("Following list:", followingStrings);
        console.log("Is following:", isFollowing);
        
        return res.status(200).json({
            success: true,
            data: {
                isFollowing
            }
        });

    } catch (error) {
        console.error("Get follow status error:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting follow status"
        });
    }
};

// Get user's followers
exports.getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId)
            .populate({
                path: 'followers',
                select: 'name username avatar bio',
                options: {
                    skip: skip,
                    limit: limit
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                followers: user.followers,
                totalFollowers: user.followerCount,
                currentPage: page,
                totalPages: Math.ceil(user.followerCount / limit)
            }
        });

    } catch (error) {
        console.error("Get followers error:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting followers"
        });
    }
};

// Get user's following
exports.getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId)
            .populate({
                path: 'following',
                select: 'name username avatar bio',
                options: {
                    skip: skip,
                    limit: limit
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                following: user.following,
                totalFollowing: user.followingCount,
                currentPage: page,
                totalPages: Math.ceil(user.followingCount / limit)
            }
        });

    } catch (error) {
        console.error("Get following error:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting following"
        });
    }
};
