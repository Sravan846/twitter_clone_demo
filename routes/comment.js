const express = require("express");
const commentCtrl = require("../controllers/comment");
const {
  commentAddValidator,
  commentReplyValidator,
} = require("../middleware/comment");

const commentRouter = express();

commentRouter.post("/add", commentAddValidator, commentCtrl.addComment);
commentRouter.get("/list", commentCtrl.listAllComments);
commentRouter.post("/reply", commentCtrl.replyComment);
commentRouter.delete("/delete", commentCtrl.deleteCommentbyid);
commentRouter.post("/likeThisComment", commentCtrl.likeThisComment);
module.exports = commentRouter;
