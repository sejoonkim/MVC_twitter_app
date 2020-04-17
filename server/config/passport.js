import LocalStrategy from "passport-local";
import User from "../models/users";

module.exports = function (passport) {
  // initialize passport configuration
  // user serialization for session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // user deserialization
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // use LocalStrategy
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        if (email)
          // to lower characters
          email = email.toLowerCase();
        // asynchronous
        process.nextTick(() => {
          User.findOne({ "local.email": email }, (err, user) => {
            // if error occurred
            if (err) return done(err);
            // do error check and get message
            if (!user)
              return done(
                null,
                false,
                req.flash("loginMessage", "No user found.")
              );
            if (!user.validPassword(password))
              return done(
                null,
                false,
                req.flash("loginMessage", "Wrong password.")
              );
            // if everything is ok
            else return done(null, user);
          });
        });
      }
    )
  );

  // add to local strategy
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        if (email) email = email.toLowerCase();
        process.nextTick(() => {
          // if user not logged in
          if (!req.user) {
            User.findOne({ "local.email": email }, (err, user) => {
              // errir
              if (err) return done(err);
              if (user) {
                // check for duplicate emails
                return done(
                  null,
                  false,
                  req.flash("signupMessage", "The email is already taken.")
                );
              } else {
                // create user
                const newUser = new User();
                // get username from req.body
                newUser.local.name = req.body.name;
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                // save
                newUser.save((err) => {
                  if (err) throw err;
                  return done(null, newUser);
                });
              }
            });
          } else {
            return done(null, req.user);
          }
        });
      }
    )
  );
};
