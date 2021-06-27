import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import React, { useState } from "react";
import axios from "./axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";

function Chat({ messages = [], setMessages, user }) {
  const [inp, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [lastSeen, setLastSeen] = useState(null);
  /* useEffect(() => {
    if (roomId)
      axios.get(`groups/sync/${roomId}`).then((response) => {
        setMessages(response.data.messages);
      });
  }, []); */
  useEffect(() => {
    if (roomId) {
      axios.get(`groups/sync/${roomId}`).then((response) => {
        setMessages(response.data.messages);
        setRoomName(response.data.name);
      });
      setLastSeen(new Date().toLocaleString());
    }
  }, [roomId]);
  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post(
      `/message/new/${roomId}`,
      {
        message: inp,
        name: user?.name,
        timestamp: new Date().toLocaleString(),
        received: true,
      },
      {
        headers: {
          "x-auth-token": user?.token,
        },
      }
    );
    setInput("");
  };

  const onChangeHandler = (e) => {
    setInput(e.target.value);
  };
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>{`Last seen at ${lastSeen}`}</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((msg) => (
          <p
            key={msg._id}
            className={`chat__message ${
              user?.userId === msg.user && "chat__receiver"
            }`}
          >
            <span className="chat__name">{msg.name}</span>
            {msg.message}
            <span className="chat__timestamp"> {msg.timestamp} </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={inp}
            onChange={onChangeHandler}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
