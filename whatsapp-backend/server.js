// importing
import express from "express";
import mongoose from "mongoose";
import messageRoutes from "./routes/messageRoutes.js";
import users from "./routes/users.js";
import auth from "./routes/auth.js";
import groups from "./routes/groups.js";
import Pusher from "pusher";
import cors from "cors";
import config from "config";

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1218273",
  key: "90ec4a66a548dfb8f613",
  secret: "38e84fc80fb4f6ef0c89",
  cluster: "ap1",
  useTLS: true,
});

// middleware
app.use(express.json());
app.use(cors());
app.use("/message", messageRoutes);
app.use("/users", users);
app.use("/auth", auth);
app.use("/groups", groups);

// DB config
const connection_url =
  "mongodb+srv://admin:<password>@cluster0.de8mk.mongodb.net/whats-app-db?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB Connected");
  const msgCollection = db.collection("messagecontents");
  const groupCollection = db.collection("groups");
  const groupChangeStream = groupCollection.watch();
  const changeStream = msgCollection.watch();

  groupChangeStream.on("change", (change) => {
    const GrpDetails = change.fullDocument;
    if (change.operationType === "insert") {
      pusher.trigger("appChanges", "groupsInsert", {
        name: GrpDetails.name,
        _id: GrpDetails._id,
      });
    }
  });
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("appChanges", "messagesInsert", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
      });
    } else {
      console.log("Error Triggering Pusher");
    }
  });
});

//api routes

// listener
app.listen(port, () => {
  console.log(`Listening on localhost: ${port}`);
});
