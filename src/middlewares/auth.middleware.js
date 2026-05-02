const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

const authMiddleware = async (req, res, next) => {
  const unauthorizedPayload = {
    message: "Unauthorized",
    code: "UNAUTHORIZED",
  };

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(unauthorizedPayload);
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json(unauthorizedPayload);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return next();
  } catch (error) {
    return res.status(401).json(unauthorizedPayload);
  }
};

module.exports = authMiddleware;
