const jwt = require("jsonwebtoken");
const Application = require("../models/Application");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const chatAuthorizationHeader = req.header("ChatAuthorization");

  if (!chatAuthorizationHeader) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    token = chatAuthorizationHeader;
    //decodes token id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const application = await Application.findById(decoded.id).select(
      "-password"
    );
    const key = await application.getJwtSecretKey();

    req.application = {
      id: application.id,
      name: application.name,
      jwtSecretKey: key,
    };

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Application not authorized, token failed");
  }

  if (!token) {
    res.status(401);
    throw new Error("Application not authorized, no token");
  }
});

module.exports = { protect };
