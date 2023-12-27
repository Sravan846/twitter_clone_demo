const mongoose = require("mongoose");
const userOnline = new mongoose.Schema({
  ID: String,
  room: Number,
  name: String,
});
module.exports = mongoose.model("onlineUser", userOnline);
