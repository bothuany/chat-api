const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto-js");

const ApplicationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    jwtSecretKey: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

ApplicationSchema.methods.getJwtSecretKey = async function () {
  const key = crypto.enc.Utf8.parse(process.env.JWT_SECRET);

  // Şifresi çözülecek veri
  const decrypted = crypto.AES.decrypt(this.jwtSecretKey, key, {
    mode: crypto.mode.ECB,
  });

  // Utf8'e çevir
  return decrypted.toString(crypto.enc.Utf8);
};

ApplicationSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  //this.jwtSecretKey = await bcrypt.hash(this.jwtSecretKey, salt);
  this.password = await bcrypt.hash(this.password, salt);

  const key = crypto.enc.Utf8.parse(process.env.JWT_SECRET);

  const data = crypto.enc.Utf8.parse(this.jwtSecretKey);

  const encrypted = crypto.AES.encrypt(data, key, { mode: crypto.mode.ECB });
  this.jwtSecretKey = encrypted.toString();
});

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = Application;
