import { userSchemaValidator } from "../validators.js";
import { User } from "../models.js";
import express from "express";
import _ from "lodash";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = userSchemaValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header({
      "x-auth-token": token,
      "Access-Control-Expose-Headers": "x-auth-token",
    })
    .send(_.pick(user, ["name", "email", "_id"]));
});

export default router;
