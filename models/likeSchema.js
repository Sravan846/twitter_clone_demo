const mongoose = require("mongoose");

const like = new mongoose.Schema({
  likeBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "comment" },
});
like.set("timestamps", true);
module.exports = mongoose.model("Like", like);
