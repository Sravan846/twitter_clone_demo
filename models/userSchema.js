const mongoose = require("mongoose");

const user = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  password: String,
  gender: String,
  otp: Number,
  otpExpires: Date,
});
user.set("timestamps", true);
module.exports = mongoose.model("user", user);
