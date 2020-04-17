var express = require("express");
var passport = require("passport");
var gravatar = require("gravatar");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express from server folder" });
});

/* GET login page. */
router.get("/login", (req, res, next) => {
  res.render("login", {
    title: "Login Page",
    message: req.flash("loginMessage"),
  });
});

/* POST login page. */
router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

/* GET signup page */
router.get("/signup", (req, res, next) => {
  res.render("signup", {
    title: "Signup Page",
    message: req.flash("signupMessage"),
  });
});

/* POST signup page. */
router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

/* GET profile page */
router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile", {
    title: "Profile Page",
    user: req.user,
    avatar: gravatar.url(
      req.user.email,
      { s: "100", r: "x", d: "retro" },
      true
    ),
  });
});

// check user logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

/* GET logout page */
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
