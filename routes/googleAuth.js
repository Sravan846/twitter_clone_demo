const express = require("express");
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const googleRouter = express();

googleRouter.get("/", ensureGuest, (req, res) => {
  res.render("google/login");
});

googleRouter.get("/log", ensureAuth, async (req, res) => {
  // res.render("google/index", { userinfo: req.user });
  req.session.name = req.user;
  res.render("home");
});

googleRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("auth/log");
  }
);

googleRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = googleRouter;
