const commentSchema = require("../models/commentSchema");
const likeSchema = require("../models/likeSchema");
const postSchema = require("../models/postSchema");
const { tokenverify } = require("./post");
module.exports = {
  addComment: async (data, socket) => {
    const { body, postid } = data;
    try {
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
          let CheckPostIdExist = await postSchema.findById(postid);
          if (CheckPostIdExist) {
            const result = await commentSchema.create({
              body,
              post: postid,
              committedBy: userid.id,
              reply: [],
            });
            await postSchema.updateOne(
              { _id: CheckPostIdExist.id },
              { $push: { comments: result.id } }
            );
            socket.emit("response", { message: "new comment is added" });
          } else {
            socket.emit("response", { message: "This post is not exist" });
          }
        }
      } else {
        socket.emit("response", { message: "Token is required" });
      }
    } catch (error) {
      socket.emit("response", { message: error.message });
    }
  },
  allComments: async (data, socket) => {
    try {
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
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
          socket.emit("response", {
            message: "List of all comments",
            result,
          });
        }
      } else {
        socket.emit("response", { message: "Token is required" });
      }
    } catch (error) {
      socket.emit("response", { message: error.message });
    }
  },
  replyComment: async (data, socket) => {
    const { commentId, body } = data;
    try {
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
          let checkParentComment = await commentSchema.findById(commentId);
          if (checkParentComment) {
            let response = await commentSchema.create({
              body,
              committedBy: userid.id,
              reply: [],
            });
            await commentSchema.updateOne(
              { _id: checkParentComment.id },
              { $push: { reply: response.id } }
            );
            socket.emit("response", { message: "you have reply this comment" });
          } else {
            socket.emit("response", {
              message: "this comment id is not exist",
            });
          }
        }
      } else {
        socket.emit("response", { message: "Token is required" });
      }
    } catch (error) {
      io.emit("response", { message: error.message });
    }
  },
  deleteCommentbyid: async (data, socket) => {
    const { commentId } = data;
    try {
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
          let checkComment = await commentSchema.find({
            id: commentId,
            userid: userid.id,
          });
          if (checkComment.length > 0) {
            await commentSchema.findByIdAndDelete(checkComment.id);
            socket.emit("response", { message: "this comment is deleted" });
          } else {
            socket.emit("response", {
              message:
                "this comment id is not exist or you not have right to delete this comment",
            });
          }
        }
      } else {
        socket.emit("response", { message: "Token is required" });
      }
    } catch (error) {
      socket.emit("response", { message: error.message });
    }
  },
  commentLike: async (data, socket) => {
    const { commentId } = data;
    try {
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
          const checkCommnetId = await commentSchema.findById(commentId);
          if (checkCommnetId) {
            let checkuser = await commentSchema
              .find({
                likes: { $in: userid.name },
              })
              .count();
            if (checkuser > 0) {
              socket.emit("response", {
                message: "Your are already liked this comment",
              });
            } else {
              await commentSchema.updateOne(
                { _id: checkCommnetId.id },
                { $push: { likes: userid.name } }
              );
              socket.emit("response", {
                message: "You liked this comment",
              });
            }
          } else {
            socket.emit("response", {
              message: "this comment id is not exist",
            });
          }
        }
      } else {
        socket.emit("response", { message: "Token is required" });
      }
    } catch (error) {
      socket.emit("response", { message: error.message });
    }
  },
};
