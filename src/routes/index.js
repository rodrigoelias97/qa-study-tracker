const express = require("express");
const authRoutes = require("./auth.routes");
const courseRoutes = require("./course.routes");

const router = express.Router();

router.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "qa-study-tracker-api",
  });
});

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);

module.exports = router;
