const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Application = require("../models/Application");
const crypto = require("crypto");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //decodes token id

      const SECRET_KEY = req.application.jwtSecretKey;
      const keyBytes = Buffer.from(SECRET_KEY, "base64");
      const decoded = jwt.verify(token, keyBytes);

      let user = await User.findOne({ email: decoded.email }).select(
        "-password"
      );

      if (!user) {
        user = await User.create({
          username: decoded.username,
          email: decoded.email,
          application: req.application.id,
        });
      }

      const updatedApplication = await Application.findByIdAndUpdate(
        req.application.id,
        {
          $addToSet: { users: user.id },
        },
        { new: true }
      ).populate("users", "-password");

      req.user = user;
      //req.application = updatedApplication;

      next();
    } catch (error) {
      res.status(401);
      throw new Error("User not authorized, token failed");
    }

    if (!token) {
      res.status(401);
      throw new Error("User not authorized, no token");
    }
  }
});

module.exports = { protect };
