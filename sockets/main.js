const {
  addComment,
  allComments,
  replyComment,
  deleteCommentbyid,
  commentLike,
} = require("./comment");
const {
  allPosts,
  addPost,
  rePost,
  deletePost,
  postDetails,
  postLike,
} = require("./post");

module.exports.mainSocket = (io, socket) => {
  socket.on("request", async (data, file) => {
    const { event, body } = data;
    try {
      switch (event) {
        // post module
        case "allPosts":
          allPosts(body, socket);
          break;
        case "addPost":
          addPost(body, file, socket);
          break;
        case "rePost":
          rePost(body, file, socket);
          break;
        case "deletePost":
          deletePost(body, socket);
          break;
        case "postDetails":
          postDetails(body, socket);
          break;
        case "postLike":
          postLike(body, socket);
          break;
        // comment module
        case "addComment":
          addComment(body, socket);
          break;
        case "allComments":
          allComments(body, socket);
          break;
        case "replyComment":
          replyComment(body, socket);
          break;
        case "deleteCommentbyid":
          deleteCommentbyid(body, socket);
          break;
        case "commentLike":
          commentLike(body, socket);
          break;

        default:
          io.emit("response", { message: "This is wrong event" });
          break;
      }
    } catch (error) {
      socket.emit("response", { message: error.message });
    }
  });
};
