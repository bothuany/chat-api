const express = require("express");
const router = express.Router();
const {
  sendMessage,
  fetchAllMessages,
} = require("../controllers/messageController");
const { protect:userProtect } = require("../middlewares/userAuthMiddleware");
const {
  protect: appProtect,
} = require("../middlewares/applicationAuthMiddleware");

router.route("/").post(appProtect, userProtect, sendMessage);
router.route("/:chatId").get(appProtect, userProtect, fetchAllMessages);

module.exports = router;
