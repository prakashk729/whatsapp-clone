import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import axios from "./axios.js";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

function SidebarChat({ id, addNewChat = false, name, user }) {
  const [lastMessage, setLastMessage] = useState(null);
  useEffect(() => {
    axios.get(`/groups/sync/${id}/lastMessage`).then((res) => {
      setLastMessage(res.data.message);
    });
  }, [id]);
  const createChatGroup = () => {
    let grpName = prompt("Please enter a group name: ");
    if (grpName)
      axios
        .post(
          "/groups/new",
          { name: grpName },
          {
            headers: {
              "x-auth-token": user?.token,
            },
          }
        )
        .catch((e) => {
          alert(e.response.data);
        });
  };
  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{lastMessage}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChatGroup} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
