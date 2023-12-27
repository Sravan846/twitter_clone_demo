const express = require("express");
const userSchema = require("../models/userSchema");
const passport = require('passport');
const frontendRouter = express();
frontendRouter.get("/register", (req, res) => {
  if (!req.session.name) {
    res.render("register", { title: "register" });
  } else {
    res.redirect("/home");
  }
});
frontendRouter.get("/", (req, res) => {
  if (!req.session.name) {
    res.render("index", { title: "Sign In" });
  } else {
    res.redirect("/home");
  }
});
frontendRouter.get("/home", (req, res) => {
  res.render("home");
});
frontendRouter.get("/pchat", (req, res) => {
  if (req.session.name) {
    res.render("pchat", { name: req.session.name });
  } else {
    res.redirect("/");
  }
});
frontendRouter.get("/logout", async (req, res) => {
  if (req.session.name) {
    await userSchema.findOneAndUpdate(
      { username: req.session.name },
      { status: false }
    );
    delete req.session.name;
    res.redirect("/");
    // console.log("logout");
  } else {
    res.redirect("/");
  }
});
frontendRouter.get("/gchat", async (req, res) => {
  if (req.session.name) {
    res.render("gchat", { name: req.session.name });
  } else {
    res.redirect("/");
  }
});
// linkedin
frontendRouter.get('/linkedin', function (req, res) {
  res.render('linkedin/index.ejs'); // load the index.ejs file
});
frontendRouter.get("/profile", isLoggedIn, function (req, res) {
  console.log(req.user);
  res.render("linkedin/profile.ejs", {
    user: req.user, // get the user out of session and pass to template
  });
});

frontendRouter.get(
  "/auth1/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  })
);

frontendRouter.get(
  "/auth1/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

frontendRouter.get("/logout1", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
module.exports = frontendRouter;
