import gravatar from "gravatar";
import Comments from "../models/comments";

// comment list
exports.list = (req, res) => {
  // sort by date
  Comments.find()
    .sort("-created")
    .populate("user", "local.email")
    .exec((error, comments) => {
      if (error) {
        return res.send(400, {
          message: error,
        });
      }
      // render results
      res.render("comments", {
        title: "Comments Page",
        comments,
        gravatar: gravatar.url(
          comments.email,
          { s: "80", r: "x", d: "retro" },
          true
        ),
      });
    });
};

// create comment
exports.create = (req, res) => {
  // create comment moedl that has request body
  const comments = new Comments(req.body);
  // set current user id
  comments.user = req.user;
  // save data received
  comments.save((error) => {
    if (error) {
      return res.send(400, {
        message: error,
      });
    }
    res.redirect("/comments");
  });
};

// middleware for authenticating comments
exports.hasAuthorization = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};
