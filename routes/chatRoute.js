const express = require("express");
const router = express.Router();

const { protect: userProtect } = require("../middlewares/userAuthMiddleware");
const {
  protect: appProtect,
} = require("../middlewares/applicationAuthMiddleware");
const {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");

router.route("/").post(appProtect, userProtect, accessChat);
router.route("/").get(appProtect, userProtect, fetchChats);
router.route("/group").post(appProtect, userProtect, createGroup);
router.route("/group/rename").put(appProtect, userProtect, renameGroup);
router.route("/group/addMember").post(appProtect, userProtect, addToGroup);
router
  .route("/group/removeMember")
  .post(appProtect, userProtect, removeFromGroup);

module.exports = router;
