const User = require('../models/User');
const Project = require('../models/Project');

// Get user profile by username
exports.getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data with follower/following counts
        const userData = {
            ...user.toObject(),
            followers: user.followerCount || 0,
            following: user.followingCount || 0
        };

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's projects
exports.getUserProjects = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching projects for userId:', userId);
        
        // First, let's get the user to see what's stored
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('Found user:', { id: user._id, username: user.username, name: user.name });
        
        // Debug: Let's see what's in the first few projects to understand the data structure
        const sampleProjects = await Project.find({}).limit(10);
        console.log('Sample projects structure:', sampleProjects.map(p => ({ 
            id: p._id, 
            name: p.name, 
            user: p.user, 
            token: p.token,
            userType: typeof p.user,
            tokenType: typeof p.token
        })));
        console.log('Total projects in database:', await Project.countDocuments());
        
        // Try multiple approaches to find projects
        console.log('Search approaches:');
        console.log('1. Searching by user ID:', user._id.toString());
        console.log('2. Searching by username:', user.username);
        console.log('3. Searching by name:', user.name);
        // Approach 1: Search by user ObjectId (if stored as ObjectId)
        let projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
        console.log('Projects found by userId:', projects.length);
        
        // Approach 2: Search by username (if stored as string)
        if (projects.length === 0) {
            projects = await Project.find({ user: user.username }).sort({ createdAt: -1 });
            console.log('Projects found by username:', projects.length);
        }
        
        // Approach 3: Search by user name (if stored as name)
        if (projects.length === 0) {
            projects = await Project.find({ user: user.name }).sort({ createdAt: -1 });
            console.log('Projects found by user name:', projects.length);
        }
        
        console.log('Total projects found:', projects.length);
        
        res.json(projects);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        // Remove fields that shouldn't be updated
        delete updates.username;
        delete updates.password;
        delete updates.createdAt;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Upload user avatar
exports.uploadAvatar = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No avatar file provided' });
        }

        // Here you would typically upload to cloudinary or another service
        // For now, we'll just use the file path
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ avatar: avatarUrl, user });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
