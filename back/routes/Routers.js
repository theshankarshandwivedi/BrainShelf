const express = require("express");

const router = express.Router();
const {registerControll} = require("../controllers/Register");
const {loginController} = require("../controllers/Login");
const {projectReg} = require("../controllers/RegisterProject");
const {getAllProjects, getProjectById} = require("../controllers/Projects");
const {rateProject, getUserRating, getProjectRatings} = require("../controllers/Rating");
const {getUserProfile, getUserProjects, updateUserProfile, uploadAvatar} = require("../controllers/Users");

// Auth routes
router.post("/register", registerControll);
router.post("/login", loginController);

// Project routes
router.post("/projects", projectReg);
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);

// Rating routes
router.post("/projects/:projectId/rate", rateProject);
router.get("/projects/:projectId/rating", getUserRating);
router.get("/projects/:projectId/ratings", getProjectRatings);

// User profile routes
router.get("/users/:username", getUserProfile);
router.get("/users/:userId/projects", getUserProjects);
router.put("/users/:userId", updateUserProfile);
router.post("/users/:userId/avatar", uploadAvatar);

module.exports = router;