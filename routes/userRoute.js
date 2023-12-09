const express = require("express");
const router = express.Router();
const { protect:userProtect } = require("../middlewares/userAuthMiddleware");
const {
  protect: appProtect,
} = require("../middlewares/applicationAuthMiddleware");

const { getUserIdByUsername,test } = require("../controllers/userController");

router.route("/test/run").get(test);
router.route("/:username").get(appProtect, userProtect, getUserIdByUsername);

module.exports = router;
