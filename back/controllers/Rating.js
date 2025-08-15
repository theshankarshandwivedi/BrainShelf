const Project = require("../models/Project");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        req.user = user;
        next();
    });
};

// Rate a project
exports.rateProject = [authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Check if user already rated this project
        const existingRatingIndex = project.ratings.findIndex(
            r => r.userId.toString() === userId
        );

        if (existingRatingIndex !== -1) {
            // Update existing rating
            project.ratings[existingRatingIndex].rating = rating;
            project.ratings[existingRatingIndex].createdAt = new Date();
        } else {
            // Add new rating
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

        await project.save();

        return res.status(200).json({
            success: true,
            message: existingRatingIndex !== -1 ? "Rating updated successfully" : "Rating added successfully",
            data: {
                userRating: rating,
                averageRating: project.averageRating,
                totalRatings: project.totalRatings
            }
        });

    } catch (error) {
        console.error("Rate project error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}];

// Get user's rating for a project
exports.getUserRating = [authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

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
