const express = require("express");
const userRouter = require("./user");
const commentRouter = require("./comment");
const { tokenVerify } = require("../middleware/user");

const mainRouter = express();

mainRouter.use("/user", userRouter);
mainRouter.use("/comment", tokenVerify, commentRouter);

module.exports = mainRouter;
