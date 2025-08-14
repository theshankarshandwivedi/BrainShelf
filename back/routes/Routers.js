const express = require("express");

const router = express.Router();
const {registerControll} = require("../controllers/Register");
const {loginController} = require("../controllers/Login");
const {projectReg} = require("../controllers/RegisterProject");
const {getAllProjects, getProjectById} = require("../controllers/Projects");
const {rateProject, getUserRating} = require("../controllers/Rating");


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

module.exports = router;