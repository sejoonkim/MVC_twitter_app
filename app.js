import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import sassMiddleware from "node-sass-middleware";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import flash from "connect-flash";

import routes from "./server/routes/index";
import users from "./server/routes/users";

const app = express();
const CookieStore = MongoStore(session);

// view engine setup
app.set("views", path.join(__dirname, "server/views/pages"));
app.set("view engine", "ejs");

// Databse config
import config from "./server/config/config";
// Database connect
mongoose.connect(config.url);
// check if mongoDB is running
mongoose.connection.on("error", () => {
  console.error("MongoDB Connection Error. Make sure MongoDB is running.");
});
// passport
import "./server/config/passport";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

// for passport
// private key for session
app.use(
  session({
    secret: "blasfijgojwefdsf",
    saveUninitialized: true,
    resave: true,
    // save session to mongoDB using express-session and connect-mongo
    store: new CookieStore({
      url: config.url,
      collection: "sessions",
    }),
  })
);
// initialize passport authentication
app.use(passport.initialize());
// permananet login session
app.use(passport.session());
// flash messages
app.use(flash());

app.use("/", routes);
app.use("/users", users);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + server.address().port);
});
