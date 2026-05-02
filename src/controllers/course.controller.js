const courseService = require("../services/course.service");

const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.user.id, req.body);
    return res.status(201).json({ course });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createCourse,
};
