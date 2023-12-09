const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");

const getUserIdByUsername = expressAsyncHandler(async (req, res) => {
  const username = req.params.username;
  const applicationId = req.application.id;
  const user = await User.findOne({
    username: username,
    application: applicationId,
  });

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const test = expressAsyncHandler(async (req, res) => {
  res.json({
    message: "test",
  });
});

module.exports = { getUserIdByUsername, test };
