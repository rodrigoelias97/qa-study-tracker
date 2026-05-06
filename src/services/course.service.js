const mongoose = require("mongoose");
const Course = require("../models/Course");

const createError = ({ statusCode, code, message, details }) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  if (details) {
    error.details = details;
  }
  return error;
};

const mapCourse = (course) => ({
  id: course.id,
  userId: course.userId.toString(),
  name: course.name,
  link: course.link,
  totalWorkloadHours: course.totalWorkloadHours,
  status: course.status,
  registrationDate: course.registrationDate,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
});

const getCourseById = async (userId, courseId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw createError({
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
      message: "Course not found",
    });
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw createError({
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
      message: "Course not found",
    });
  }

  if (course.userId.toString() !== userId) {
    throw createError({
      statusCode: 403,
      code: "FORBIDDEN",
      message: "Forbidden",
    });
  }

  return mapCourse(course);
};

module.exports = {
  getCourseById,
};
