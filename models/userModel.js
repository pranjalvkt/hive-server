const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { 
    data: Buffer, 
    contentType: String 
  },
});

module.exports = mongoose.model("User", UserSchema);