socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
let fromUser = localStorage.getItem("from");
let toUser = localStorage.getItem("to");
//socket.emit('userDetails',{fromUser,toUser});

function storeDetails(fromuser, touser) {
  fromUser = fromuser;
  //   toUser = document.getElementById("to").value==""?localStorage.getItem("to"): document.getElementById("to").value;
  toUser = touser;
  if (toUser) {
    localStorage.removeItem("from");
    localStorage.removeItem("to");
    localStorage.setItem("from", fromUser);
    localStorage.setItem("to", toUser);
    element = document.querySelectorAll(".chat-messages");
    socket.emit("userDetails", { fromUser, toUser }); //emits details of established chat
    // socket.emit('userDetails',{fromUser,ChatRoom});
  }
}
setInterval(() => {
  storeDetails(localStorage.getItem("from"), localStorage.getItem("to"));
}, 2000);

//Submit message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault(); //Prevents default logging to a file
  const msg = e.target.elements.msg.value;
  final = {
    fromUser: localStorage.getItem("from"),
    to: localStorage.getItem("to"),
    msg: msg,
  };
  socket.emit("chatMessage", final); //emits chat message along with sender and reciever to server
  document.getElementById("msg").value = " ";
});

socket.on("output", (data) => {
  //recieves the entire chat history upon logging in between two users and displays them
  document.querySelector(".chatbox").innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    outputMessage(data[i]);
  }
  //   chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("message", (data) => {
  //recieves a message and displays it
  outputMessage(data);
  // console.log(data);
  //   chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputMessage(message) {
  const div = document.createElement("div");
  // div.innerHTML = `<p class="meta">${message.from}<span> ${message.time}, ${message.date}</span></p>
  //   <p class ="text">
  //       ${message.message}
  //   </p>`;
  if (message.from == localStorage.getItem("from")) {
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

socket.on("userList", (data) => {
  showdropdown(data);
});
socket.on('userStatus',(data)=>{
  debugger
  console.log('usStatus', data)
  document.getElementById("usStatus").innerHTML=data.status
})
function showdropdown(data) {
  document.getElementById("usList").innerHTML = "";
  var dropdown = ``;
  // console.log(toUser);
  var a = 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].name != localStorage.getItem("from")) {
      if (data[i].name == localStorage.getItem("to")) {
        dropdown += `
            <div class="block active" onclick="getuser('${data[i].name}')">
            <div class="imgBox">
                        <img src="images/${a}.jpg" class="cover" alt="">
                    </div>
                  <div class="details">
                      <div class="listHead">
                          <h4>${data[i].name}</h4>
                      </div>
                  </div>
              </div>
            `;
      } else {
        dropdown += `
              <div class="block unread" onclick="getuser('${data[i].name}')">
              <div class="imgBox">
                        <img src="images/${a}.jpg" class="cover" alt="">
                    </div>
                    <div class="details">
                        <div class="listHead">
                            <h4>${data[i].name}</h4>
                        </div>
                    </div>
                </div>
              `;
      }
      a += 1;
    }
  }

  document.getElementById("usList").innerHTML = dropdown;
}
