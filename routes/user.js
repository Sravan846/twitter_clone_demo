const express = require("express");
const userCntrl = require("../controllers/user");
const {
  registerValidator,
  loginValidator,
  otpValidator,
} = require("../middleware/user");

const userRouter = express();

userRouter.post("/register", registerValidator, userCntrl.userRegister);
userRouter.post("/login", loginValidator, userCntrl.userLogin);
userRouter.post("/forgotPassowrd", userCntrl.forgotPassowrd);
userRouter.post("/verifyOtp", otpValidator, userCntrl.verifyOtp);

module.exports = userRouter;
