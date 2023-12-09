const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", UserSchema);

UserSchema.pre("save", async function (next) {
  const existingUser = await this.constructor.findOne({
    username: this.username,
    application: this.application,
  });

  const existingEmail = await this.constructor.findOne({
    email: this.email,
    application: this.application,
  });

  if (existingUser || existingEmail) {
    const error = new Error("User already exists");
    return next(error);
  }

  next();
});


module.exports = User;
