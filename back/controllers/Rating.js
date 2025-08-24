const Project = require("../models/Project");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Auth header:', authHeader);
    console.log('Extracted token:', token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({
            success: false,
            message: "Access token required"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification error:', err);
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        console.log('Token verified successfully, user:', user);
        req.user = user;
        next();
    });
};

// Rate a project
exports.rateProject = [authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { rating } = req.body;
        const userId = req.user._id; // Fixed: use _id instead of id

        console.log('Rating request:', { projectId, rating, userId, user: req.user });

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            console.log('Invalid project ID format:', projectId);
            return res.status(400).json({
                success: false,
                message: "Invalid project ID format"
            });
        }

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            console.log('Invalid rating:', rating);
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            console.log('Project not found:', projectId);
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        console.log('Found project:', project.name);

        // Check if user already rated this project
        const existingRatingIndex = project.ratings.findIndex(
            r => r.userId.toString() === userId
        );

        if (existingRatingIndex !== -1) {
            // Update existing rating
            console.log('Updating existing rating');
            project.ratings[existingRatingIndex].rating = rating;
            project.ratings[existingRatingIndex].createdAt = new Date();
        } else {
            // Add new rating
            console.log('Adding new rating');
            project.ratings.push({
                userId: userId,
                rating: rating
            });
        }

        // Recalculate average rating
        const totalRatings = project.ratings.length;
        const sumRatings = project.ratings.reduce((sum, r) => sum + r.rating, 0);
        project.averageRating = Math.round((sumRatings / totalRatings) * 10) / 10; // Round to 1 decimal
        project.totalRatings = totalRatings;

        console.log('Before save - Average:', project.averageRating, 'Total:', project.totalRatings);

        // Use findByIdAndUpdate to avoid full model validation issues
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                ratings: project.ratings,
                averageRating: project.averageRating,
                totalRatings: project.totalRatings
            },
            { 
                new: true, 
                runValidators: false  // Skip validation to avoid issues with existing data
            }
        );

        console.log('Rating saved successfully');

        return res.status(200).json({
            success: true,
            message: existingRatingIndex !== -1 ? "Rating updated successfully" : "Rating added successfully",
            data: {
                userRating: rating,
                averageRating: updatedProject.averageRating,
                totalRatings: updatedProject.totalRatings
            }
        });

    } catch (error) {
        console.error("Rate project error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}];

// Get user's rating for a project
exports.getUserRating = [authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id; // Fixed: use _id instead of id

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const userRating = project.ratings.find(
            r => r.userId.toString() === userId
        );

        return res.status(200).json({
            success: true,
            data: {
                userRating: userRating ? userRating.rating : 0,
                averageRating: project.averageRating,
                totalRatings: project.totalRatings,
                hasRated: !!userRating
            }
        });

    } catch (error) {
        console.error("Get user rating error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}];

// Get project ratings (public endpoint)
exports.getProjectRatings = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                averageRating: project.averageRating,
                totalRatings: project.totalRatings
            }
        });

    } catch (error) {
        console.error("Get project ratings error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
