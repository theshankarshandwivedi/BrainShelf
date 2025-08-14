const express = require("express");

const router = express.Router();
const {registerControll} = require("../controllers/Register");
const {loginController} = require("../controllers/Login");
const {projectReg} = require("../controllers/RegisterProject");
const {getAllProjects, getProjectById} = require("../controllers/Projects");


// Auth routes
router.post("/register", registerControll);
router.post("/login", loginController);

// Project routes
router.post("/projects", projectReg);
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);

module.exports = router;