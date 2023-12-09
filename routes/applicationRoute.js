const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/applicationController");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get();

module.exports = router;
