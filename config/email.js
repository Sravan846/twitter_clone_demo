const nodeMailer = require("nodemailer");
require("dotenv").config();

const transPoter = nodeMailer.createTransport({
  // service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
  tls: {
    secureProtocol: "TLSv1_method",
  },
});

function sendMail(toEmail, data) {
  var mailOptions = {
    from: process.env.email,
    to: toEmail,
    subject: "Verify email for change password",
    text: `Your otp is: ${data}`,
  };

  transPoter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

module.exports = sendMail;
