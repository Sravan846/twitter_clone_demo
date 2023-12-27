const commentSchema = require("../models/commentSchema");
const likeSchema = require("../models/likeSchema");
const postSchema = require("../models/postSchema");

module.exports = {
  addComment: async (req, res) => {
    const { body, postid } = req.body;
    try {
      let CheckPostIdExist = await postSchema.findById(postid);
      if (CheckPostIdExist) {
        const result = await commentSchema.create({
          body,
          post: postid,
          committedBy: req.userid,
          reply: [],
        });
        await postSchema.updateOne(
          { _id: CheckPostIdExist.id },
          { $push: { comments: result.id } }
        );
        res.json({ message: "new comment is added" });
      } else {
        res.json({ message: "This post is not exist" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  listAllComments: async (req, res) => {
    try {
      let response = await commentSchema
        .find()
        .populate({ path: "committedBy", select: { name: 1, _id: 0 } });
      let result = [];
      response.forEach((i) => {
        result.push({
          id: i.id,
          body: i.body,
          post: i.post,
          committedBy: i.committedBy,
          reply: i.reply.length,
          likes: i.likes.length,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
        });
      });
      res.status(200).json({ message: "List of all comments", result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  replyComment: async (req, res) => {
    const { commentId, body } = req.body;
    try {
      let checkParentComment = await commentSchema.findById(commentId);
      if (checkParentComment) {
        let response = await commentSchema.create({
          body,
          committedBy: req.userid,
          reply: [],
        });
        await commentSchema.updateOne(
          { _id: checkParentComment.id },
          { $push: { reply: response.id } }
        );
        res.status(200).json({ message: "you have reply this comment" });
      } else {
        res.status(400).json({
          message: "this comment id is not exist",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteCommentbyid: async (req, res) => {
    const { commentId } = req.query;
    try {
      let checkComment = await commentSchema.find({
        id: commentId,
        userid: req.userid,
      });
      if (checkComment.length > 0) {
        await commentSchema.findByIdAndDelete(checkComment.id);
        res.status(200).json({ message: "this comment is deleted" });
      } else {
        res.status(400).json({
          message:
            "this comment id is not exist or you not have right to delete this comment",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  likeThisComment: async (req, res) => {
    const { commentId } = req.body;
    try {
      const checkCommnetId = await commentSchema.findById(commentId);
      if (checkCommnetId) {
        let checkuser = await commentSchema
          .find({
            likes: { $in: req.userName },
          })
          .count();
        if (checkuser > 0) {
          res.status(400).json({
            message: "Your are already liked this comment",
          });
        } else {
          await commentSchema.updateOne(
            { _id: checkCommnetId.id },
            { $push: { likes: req.userName } }
          );
          res.status(400).json({
            message: "You liked this comment",
          });
        }
      } else {
        res.status(400).json({
          message: "this comment id is not exist",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
