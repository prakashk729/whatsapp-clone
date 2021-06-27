import express from "express";
import Messages from "../dbMessages.js";
import { Group, Message } from "../models.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* router.get("/", (req, res) => {
  res.status(200).send("hello world");
}); */

//Remember to put auth middleware as a 2nd argument to the route handlers
//so only if user is logged in can post messages or create groups

router.post("/new/:roomId", auth, async (req, res) => {
  const userId = req.user._id;
  const message = new Message({
    ...req.body,
    user: userId,
  });
  const grp = await Group.findById(req.params.roomId);
  await grp.messages.push(message);
  grp.save();
  return res.status(201).send("Message Sent");

  /* Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  }); */
});

/* router.get("/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  }); 
}); */

export default router;
