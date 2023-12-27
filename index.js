const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes");
const passport = require("passport");
const session = require("express-session");
require("./config/db");
require("dotenv").config();
require("./config/google")(passport);
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const googleRouter = require("./routes/googleAuth");
const frontendRouter = require("./routes/frontend");
const { mainSocket } = require("./sockets/main");
const { privatChat } = require("./sockets/privateChat");
const { groupChat } = require("./sockets/groupchat");
const pub = require('./config/pub');
const sub = require('./config/sub');
const sendMail = require("./config/email");

const app = express();

pub()
sub()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(
  session({
    secret: "secratekey",
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");
app.use("/api", mainRouter);
app.use("/auth", googleRouter);

passport.use(
  new LinkedInStrategy(
    {
      clientID: "77a9ekkryey9hd",
      clientSecret: "rSwWUfVDOjRtuYn7",
      callbackURL: "http://localhost:3000/auth1/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    function (token, tokenSecret, profile, done) {
      return done(null, profile);
    }
  )
);
app.use("/", frontendRouter);

app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    error: "Not found",
  });
});

const server = http.createServer(app);
global.io = new Server(server);
io.on("connection", (socket) => {
  console.log(socket.id);
  console.log("a user connected");
  privatChat(socket);
  groupChat(socket);
  mainSocket(io, socket);
 
});
const port = process.argv[2] || 3000;
server.listen(port, () => {
  sendMail("test1@yopmail.com","133")
  console.log("server is started port: ",port);
});
