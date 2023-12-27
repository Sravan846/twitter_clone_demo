const moment = require("moment");
const onlineUser = require("../models/onlineUser");
const userMSG = require("../models/userMSG");
const formatMessage = (data) => {
  msg = {
    from: data.name,
    Room: Number(data.room),
    message: data.msg,
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("hh:mm a"),
  };
  return msg;
};
var Oname = "";
module.exports = {
  groupChat: async (socket) => {
    socket.on("chatMSG", async (data) => {
      //recieves message from client-end along with sender's and reciever's details
      if (data.msg != " " && data.msg != "") {
        var dataElement = formatMessage(data);
        await userMSG.create(dataElement);
        socket.emit("message", dataElement);
      }
      let response = await onlineUser.findOne({ name: data.name });
      if (response != null) {
        socket.to(response.ID).emit("message", dataElement);
      }
    });
    socket.on("userMessages", async (data) => {
      var msglist = "";
      Oname = data.userName;
      //checks if a new user has logged in and recieves the established chat details
      var onlineuser = {
        //forms JSON object for the user details
        ID: socket.id,
        room: Number(data.room),
        name: data.userName,
      };
      var myquery = {};
      myquery["$or"] = [{ ID: socket.id }, { name: data.userName }];
      const result = await onlineUser.findOne(myquery);
      msglist = await userMSG.find(
        // {
        //   $or: [
        //     { from: data.userName, Room: Number(data.room) },
        { Room: Number(data.room) },
        //   ],
        // },
        { projection: { _id: 0 } }
      );
      socket.emit("output", msglist);
      if (result) {
        console.log(result.name + " is online...");
      } else {
        const chatresp = await onlineUser.create(onlineuser);
        console.log(chatresp.name + " is online...");
      }
    });
    var userID = socket.id;
    socket.on("disconnect", async () => {
      var myquery = {};
      myquery["$or"] = [{ ID: userID }, { name: Oname }];
      const result = await onlineUser.findOne(myquery);
      if (result) {
        Oname = "";
        await onlineUser.findByIdAndDelete(result.id);
        // await userMSG.deleteMany({ from: result.name });
        console.log("User " + userID + "went offline...");
      }
    });
    socket.on("clearGchat", async (data) => {
      await userMSG.deleteMany({ from: data.name, Room: data.room });
      console.log("User " + userID + "went offline...");
    });
  },
};
