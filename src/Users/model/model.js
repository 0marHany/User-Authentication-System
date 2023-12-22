const mongoose = require("mongoose");
const UserSchema = require("../schema/userSchema");

exports.User = mongoose.model("user", UserSchema);