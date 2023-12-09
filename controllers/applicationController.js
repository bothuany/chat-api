const Application = require("../models/Application");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");

const register = asyncHandler(async (req, res) => {
  const { name, jwtSecretKey, password } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }
  if (!jwtSecretKey) {
    res.status(400);
    throw new Error("JWT Secret Key is required");
  }
  //To check password length is greater than 6

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }
  if (jwtSecretKey.length < 6) {
    res.status(400);
    throw new Error("PasswoJWT Secret Keyrd must be at least 6 characters");
  }
  //To check Applicationname and name are available
  const isNameInUse = await Application.findOne({ name });

  if (isNameInUse) {
    res.status(400);
    throw new Error("Entered name already in use");
  }

  //Create a new Application
  const application = await Application.create({
    name,
    jwtSecretKey,
    password,
  });

  if (application) {
    res.status(201).json({
      _id: application._id,
      name: application.name,
      jwtSecretKey: application.jwtSecretKey,
      token: generateToken(application._id),
    });
  } else {
    res.status(400);
    throw new Error("Couldn't create Application");
  }
});

const login = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const application = await Application.findOne({ name });

  if (application) {
    if (await application.matchPassword(password)) {
      res.json({
        _id: application._id,
        name: application.name,
        token: generateToken(application._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid password");
    }
  } else {
    res.status(401);
    throw new Error("Invalid name");
  }
});
/*
//api/Application?search=Applicationname
const allApplications = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const Applications = await Application.find(keyword).find({ _id: { $ne: req.Application._id } });

  res.status(200).send(Applications);
});

*/
module.exports = { register, login };
