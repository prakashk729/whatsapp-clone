import { Group, User } from "../models.js";
import express, { response } from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/new", auth, async (req, res) => {
  const group = new Group({
    name: req.body.name,
  });
  await group.save();
  const userById = await User.findById(req.user._id);
  userById.groups.push(group);
  await userById.save();
  res.status(201).send(group);
});

router.get("/sync", auth, async (req, res) => {
  const userById = await User.findById(req.user._id).populate("groups");
  res.status(200).send(userById.groups);
});
router.get("/sync/:groupId/lastMessage", async (req, res) => {
  const grp = await Group.findById(req.params.groupId);
  res.status(200).send(grp.messages[grp.messages.length - 1]);
});

router.get("/sync/:groupId", async (req, res) => {
  if (req.params.groupId) {
    const grp = await Group.findById(req.params.groupId);
    res.status(200).send(grp);
  } else {
    res.status(404).send("Group Id missing in the URL");
  }
});
router.get("/sync/messages/:groupId", async (req, res) => {
  if (req.params.groupId) {
    const grp = await Group.findById(req.params.groupId);
    res.status(200).send(grp);
  } else {
    res.status(404).send("Group Id missing in the URL");
  }
});

export default router;
