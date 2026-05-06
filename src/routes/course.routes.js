const express = require("express");
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:id", authMiddleware, courseController.getCourseById);

module.exports = router;
