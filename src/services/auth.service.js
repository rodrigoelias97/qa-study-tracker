const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

const createError = ({ statusCode, code, message, details }) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  if (details) {
    error.details = details;
  }
  return error;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegisterPayload = ({ name, email, password }) => {
  const invalidFields = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    invalidFields.push("name");
  }

  if (!email || typeof email !== "string" || !email.trim() || !emailRegex.test(email)) {
    invalidFields.push("email");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    invalidFields.push("password");
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

const buildToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const register = async ({ name, email, password }) => {
  validateRegisterPayload({ name, email, password });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError({
      statusCode: 409,
      code: "EMAIL_CONFLICT",
      message: "Email already in use",
      details: {
        fields: ["email"],
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = buildToken({ sub: user.id, email: user.email });
  return { user: sanitizeUser(user), token };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid or missing required fields",
      details: {
        fields: ["email", "password"].filter((field) => !({ email, password })[field]),
      },
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw createError({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw createError({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials",
    });
  }

  const token = buildToken({ sub: user.id, email: user.email });
  return { user: sanitizeUser(user), token };
};

module.exports = {
  register,
  login,
};
