const courseService = require("../services/course.service");

const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.user.id, req.params.id);
    return res.status(200).json({ course });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCourseById,
};
