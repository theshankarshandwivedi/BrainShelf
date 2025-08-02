const express = require("express");

const router = express.Router();
const {registerControll} = require("../controllers/Register");
const {projectReg} = require("../controllers/RegisterProject");


router.post("/register",registerControll);
router.post("/postImage",projectReg);
module.exports = router;