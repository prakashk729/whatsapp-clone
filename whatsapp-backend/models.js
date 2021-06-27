import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const messageSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: Date,
  received: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  messages: [messageSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Group = mongoose.model("Group", groupSchema);

const User = mongoose.model("User", userSchema);

const Message = mongoose.model("Message", messageSchema);

export { User, Group, Message };
