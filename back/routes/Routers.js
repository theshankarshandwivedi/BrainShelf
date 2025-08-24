const express = require("express");

const router = express.Router();
const {registerControll} = require("../controllers/Register");
const {loginController} = require("../controllers/Login");
const {projectReg} = require("../controllers/RegisterProject");
const {getAllProjects, getProjectById, deleteProject} = require("../controllers/Projects");
const {rateProject, getUserRating, getProjectRatings} = require("../controllers/Rating");
const {getUserProfile, getUserProjects, updateUserProfile, uploadAvatar} = require("../controllers/Users");
const {followUser, unfollowUser, getFollowStatus, getFollowers, getFollowing} = require("../controllers/Follow");
const {authenticateToken} = require("../middleware/auth");

// Auth routes
router.post("/register", registerControll);
router.post("/login", loginController);

// Project routes
router.post("/projects", projectReg);
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);
router.delete("/projects/:id", authenticateToken, deleteProject);

// Rating routes
router.post("/projects/:projectId/rate", rateProject);
router.get("/projects/:projectId/rating", getUserRating);
router.get("/projects/:projectId/ratings", getProjectRatings);

// User profile routes
router.get("/users/:username", getUserProfile);
router.get("/users/:userId/projects", getUserProjects);
router.put("/users/:userId", updateUserProfile);
router.post("/users/:userId/avatar", uploadAvatar);

// Follow routes (protected)
router.post("/users/:userIdToFollow/follow", authenticateToken, followUser);
router.delete("/users/:userIdToUnfollow/unfollow", authenticateToken, unfollowUser);
router.get("/users/:userId/follow-status", authenticateToken, getFollowStatus);
router.get("/users/:userId/followers", getFollowers);
router.get("/users/:userId/following", getFollowing);

// TEMPORARY: Migration route - REMOVE AFTER RUNNING ONCE
router.get("/admin/migrate-follow-fields", async (req, res) => {
    try {
        const migrateFollowFields = require('../migrateFollowFields');
        await migrateFollowFields();
        res.json({ success: true, message: 'Migration completed successfully' });
    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;