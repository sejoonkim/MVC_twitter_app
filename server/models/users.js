import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  // local key for local strategy passport
  local: {
    name: String,
    email: String,
    password: String,
  },
});

// encrypt password
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check validity of password
userSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.local.password);
};

// create user model and expose
module.exports = mongoose.model("User", userSchema);
