const mongoose = require("mongoose");

const post = new mongoose.Schema({
  tittle: String,
  pic: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  likes: [String],
});
post.set("timestamps", true);

module.exports = mongoose.model("post", post);
