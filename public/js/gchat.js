socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//socket.emit('userDetails',{fromUser,toUser});

function storeDetails() {
  userName = localStorage.getItem("username");
  room = localStorage.getItem("room");

  // localStorage.removeItem("username");
  // localStorage.removeItem("room");
  // localStorage.setItem("username", userName);
  // localStorage.setItem("room", room);
  element = document.querySelectorAll(".chat-messages");
  // console.log(room);
  socket.emit("userMessages", { userName, room }); //emits details of established chat
}
setInterval(() => {
  storeDetails();
}, 2000);

//Submit message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault(); //Prevents default logging to a file
  const msg = e.target.elements.msg.value;
  final = {
    name: localStorage.getItem("username"),
    room: localStorage.getItem("room"),
    msg: msg,
  };
  socket.emit("chatMSG", final); //emits chat message along with sender and reciever to server
  document.getElementById("msg").value = " ";
});

socket.on("output", (data) => {
  // console.log(data);
});

socket.on("output", (data) => {
  //recieves the entire chat history upon logging in between two users and displays them
  console.log(room);
  document.querySelector(".chatbox").innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    outputMessage(data[i]);
  }
  // chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("message", (data) => {
  //recieves a message and displays it
  outputMessage(data);
  // console.log(data);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputMessage(message) {
  const div = document.createElement("div");
  // div.innerHTML = `<p class="meta">${message.from}<span> ${message.time}, ${message.date}</span></p>
  //   <p class ="text">
  //       ${message.message}
  //   </p>`;
  if (message.from == userName) {
    div.innerHTML = `
   <div class="message my_msg">
  <p> ${message.message} <br>
   <span >  ${message.time}, ${message.date}</span></p>
    </div>
   `;
  } else {
    div.innerHTML = `
    <div class="message friend_msg">
   <p> ${message.message} <br> 
    <span >${message.from}  ${message.time}, ${message.date}</span></p>
  </div>
    `;
  }
  document.querySelector(".chatbox").appendChild(div);
}

socket.on("userList1", (data) => {
  showdropdown(data);
});
function showdropdown(data) {
  document.getElementById("to").innerHTML = "";
  var dropdown = `<option value="">select user</option>`;
  // console.log(data);
  data.forEach((e) => {
    if (e.username !== document.getElementById("from").value) {
      dropdown += `<option value="${e.username}">${e.username}</option>`;
    }
  });
  document.getElementById("to").innerHTML = dropdown;
}
