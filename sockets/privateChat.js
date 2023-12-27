const userSchema = require("../models/userSchema");
const onlineUser = require("../models/onlineUser");
const userMSG = require("../models/userMSG");
const moment = require("moment");
var Oname = "";
const formatMessage = (data) => {
  msg = {
    from: data.fromUser,
    to: data.to,
    message: data.msg,
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("hh:mm a"),
  };
  return msg;
};
module.exports = {
  privatChat: async (socket) => {
    var response = await userSchema.find();
    publisher.publish("pChat",JSON.stringify({event: "userList",response}));
    // socket.emit("userList", response);
    //Collect message and insert into database
    socket.on("chatMessage", async (data) => {
      //recieves message from client-end along with sender's and reciever's details
      if (data.msg != " " && data.msg != "") {
        var dataElement = formatMessage(data);
        await userMSG.create(dataElement);
        publisher.publish("pChat",JSON.stringify({event: "message",response:dataElement}));
        // socket.emit("message", dataElement);
      }
      let response = await onlineUser.findOne({ name: data.toUser });
      if (response != null) {
        socket.to(response.ID).emit("message", dataElement);
      }
    });
    socket.on("userDetails", async (data) => {
      var msglist = "";
      Oname = data.fromUser;
      //checks if a new user has logged in and recieves the established chat details
      var onlineuser = {
        //forms JSON object for the user details
        ID: socket.id,
        ChatRoom: data.ChatRoom,
        name: data.fromUser,
      };
      var myquery = {};
      myquery["$or"] = [{ ID: socket.id }, { name: data.fromUser }];
      const result = await onlineUser.findOne(myquery);
      msglist = await userMSG.find(
        {
          $or: [
            { from: data.fromUser, to: data.toUser },
            { from: data.toUser, to: data.fromUser },
          ],
        },
        { projection: { _id: 0 } }
      );
      var result12 = await userSchema.find();
      publisher.publish("pChat",JSON.stringify({event: "output",response:msglist}));
      publisher.publish("pChat",JSON.stringify({event: "userList",response:result12}));
      // socket.emit("output", msglist);
      // socket.emit("userList", result12);
      if (result) {
        console.log(result.name + " is online...");
        socket.to(result.ID).emit("userStatus", {status:"online"});
      } else {
        const chatresp = await onlineUser.create(onlineuser);
        console.log(chatresp.name + " is online...");
        socket.to(chatresp.ID).emit("userStatus", {status:"online"});
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
        socket.to(result.ID).emit("userStatus", {status:"offline"});
      }
    });
    socket.on("clearchat", async (name) => {
      await userMSG.deleteMany({ from: name.name, to: name.touser });
      console.log("User " + userID + "went offline...");
      socket.to(result.ID).emit("userStatus", {status:"offline"});
    });
  },
};
