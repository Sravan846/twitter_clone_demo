const json = require("jsonwebtoken");
const postSchema = require("../models/postSchema");
const userSchema = require("../models/userSchema");
const fs = require("fs");
const likeSchema = require("../models/likeSchema");
require("dotenv").config();

const tokenverify = async (token, io) => {
  try {
    const verify = json.verify(token, process.env.secrate);
    let checkIdExist = await userSchema.findById(verify.id);
    if (checkIdExist) {
      return checkIdExist;
    } else {
      io.emit("response", { message: "this id is not exist" });
    }
  } catch (error) {
    io.emit("response", { message: error.message });
  }
};
module.exports = {
  allPosts: async (data, socket) => {
    try {
      let response = await postSchema
        .find()
        .sort({ createdAt: -1 })
        .populate([
          { path: "createdBy", select: { name: 1, email: 1, _id: 0 } },
        ]);
      let result = [];
      response.forEach((i) => {
        result.push({
          id: i.id,
          tittle: i.tittle,
          pic: i.pic,
          description: i.description,
          post: i.post,
          createdBy: i.createdBy,
          comments: i.comments.length,
          likes: i.likes.length,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
        });
      });
      socket.emit("response", result);
    } catch (error) {
      socket.emit("response", { message: error.message });
    }
  },
  addPost: async (data, file, socket) => {
    const { tittle, description } = data;
    try {
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
          let base64String = file.toString("base64");
          let base46Image = base64String.split(";base64,");
          let pic = Date.now() + "." + "jpeg";
          console.log(base46Image[1]);
          fs.writeFile(
            `uploads/${pic}`,
            base46Image[0],
            { encoding: "base64" },
            async (err, succ) => {
              if (err) {
                console.log(err);
              }
            }
          );
          await postSchema.create({
            tittle,
            description,
            pic: `http://localhost:3000/${pic}`,
            createdBy: userid.id,
            comments: [],
          });
          socket.emit("response", "New post is added");
        }
      } else {
        socket.emit("response", { message: "Token is required" });
      }
    } catch (error) {
      socket.emit("response", { message: error.message });
    }
  },
  rePost: async (data, file, socket) => {
    const { tittle, description, postid } = data;
    try {
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
          const checkPostExist = await postSchema.find({
            _id: postid,
            createdBy: userid.id,
          });
          if (checkPostExist.length > 0) {
            let base64String = file.toString("base64");
            let base46Image = base64String.split(";base64,");
            let pic = Date.now() + "." + "jpeg";
            console.log(base46Image[1]);
            fs.writeFile(
              `uploads/${pic}`,
              base46Image[0],
              { encoding: "base64" },
              async (err, succ) => {
                if (err) {
                  console.log(err);
                }
              }
            );
            await postSchema.findByIdAndUpdate(postid, {
              tittle,
              description,
              pic: `http://localhost:4000/${pic}`,
            });
            socket.emit("response", { message: "This post details updated" });
          } else {
            socket.emit("response", {
              message:
                "This post is not exist or you have not rights update this post",
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
  deletePost: async (data, socket) => {
    const { postid } = data;
    try {
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
          let checkPostExist = await postSchema.find({
            _id: postid,
            createdBy: userid.id,
          });
          if (checkPostExist.length > 0) {
            await postSchema.findByIdAndDelete(postid);
            socket.emit("response", { message: "This post details deleted" });
          } else {
            socket.emit("response", {
              message:
                "This post is not exist or you have not rights update this post",
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
  postDetails: async (data, socket) => {
    const { id } = data;
    try {
      let response = await postSchema.findById(id)
      .populate([
        { path: "createdBy", select: { name: 1, email: 1, _id: 0 } },
        {
          path: "comments",
          populate: [
            {
              path: "reply",
              populate: [
                {
                  path: "reply",
                },
                { path: "committedBy", select: { name: 1, _id: 0 } },
              ],
            },
            { path: "committedBy", select: { name: 1, _id: 0 } },
          ],
        },
      ]);
      socket.emit("response", response);
    } catch (error) {
      socket.emit("response", { message: error.message });
    }
  },
  postLike: async (data, socket) => {
    const { postId } = data;
    try {
      const checkPostId = await postSchema.findById(postId);
      let token = socket.handshake.headers.authorization;
      if (token) {
        let userid = await tokenverify(token, socket);
        if (userid) {
          if (checkPostId) {
            let checkuser = await postSchema
              .find({
                likes: { $in: userid.name },
              })
              .count();
            if (checkuser > 0) {
              socket.emit("response", {
                message: "Your are already liked this post",
              });
            } else {
              await postSchema.updateOne(
                { _id: checkPostId.id },
                { $push: { likes: userid.name } }
              );
              socket.emit("response", { message: "You liked this post" });
            }
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
  tokenverify,
};
