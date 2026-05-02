const express = require("express");
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, courseController.createCourse);

module.exports = router;
