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

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch (_error) {
    return false;
  }
};

const validateCreateCoursePayload = ({ name, link, totalWorkloadHours, status, registrationDate }) => {
  const invalidFields = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    invalidFields.push("name");
  }

  if (!link || typeof link !== "string" || !isValidUrl(link.trim())) {
    invalidFields.push("link");
  }

  if (typeof totalWorkloadHours !== "number" || Number.isNaN(totalWorkloadHours) || totalWorkloadHours <= 0) {
    invalidFields.push("totalWorkloadHours");
  }

  if (!status || typeof status !== "string" || !status.trim()) {
    invalidFields.push("status");
  }

  const parsedDate = new Date(registrationDate);
  if (!registrationDate || Number.isNaN(parsedDate.getTime())) {
    invalidFields.push("registrationDate");
  }

  if (invalidFields.length > 0) {
    throw createError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid or missing required fields",
      details: {
        fields: invalidFields,
      },
    });
  }
};

const createCourse = async (userId, payload) => {
  validateCreateCoursePayload(payload);

  const course = await Course.create({
    userId,
    name: payload.name.trim(),
    link: payload.link.trim(),
    totalWorkloadHours: payload.totalWorkloadHours,
    status: payload.status.trim(),
    registrationDate: payload.registrationDate,
  });

  return {
    id: course.id,
    userId: course.userId.toString(),
    name: course.name,
    link: course.link,
    totalWorkloadHours: course.totalWorkloadHours,
    status: course.status,
    registrationDate: course.registrationDate,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
};

module.exports = {
  createCourse,
};
