const mongoose = require("mongoose");

const comments = new mongoose.Schema({
  body: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
  committedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  reply: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  likes: [String],
});
comments.set("timestamps", true);
module.exports = mongoose.model("comment", comments);
