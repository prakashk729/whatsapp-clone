import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";
import axios from "./axios.js";
import Pusher from "pusher-js";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";

function Sidebar({ setMessages, messages = [], user, setUser }) {
  const [groups, setGroups] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    console.log("SIdebarJS::GroupSync Called");
    if (!groups.length)
      axios
        .get("/groups/sync", {
          headers: {
            "x-auth-token": user?.token,
          },
        })
        .then((response) => {
          setGroups(response.data);
        });
  }, []);
  useEffect(() => {
    const pusher = new Pusher("90ec4a66a548dfb8f613", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe("appChanges");
    channel.bind("groupsInsert", function (newGroup) {
      setGroups([...groups, newGroup]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [groups]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleItemClick = () => {
    setUser(null);
  };

  const getGrpMessages = (id) => {
    axios.get(`groups/sync/messages/${id}`).then((response) => {
      setMessages([...messages, ...response.data.messages]);
    });
  };
  return (
    <div className="sidebar">
      <div key="sidebar__header" className="sidebar__header">
        <Avatar src="https://www.nicepng.com/png/full/186-1866063_dicks-out-for-harambe-sample-avatar.png" />
        <div className="sidebar__headerRight">
          <IconButton key={"DonutLargeIcon"}>
            <DonutLargeIcon />
          </IconButton>
          <IconButton key={"ChatIcon"}>
            <ChatIcon />
          </IconButton>
          <IconButton key={"MoreVertIcon"} onClick={handleClick}>
            <MoreVertIcon />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClose={handleClose} onClick={handleItemClick}>
                Logout
              </MenuItem>
            </Menu>
          </IconButton>
        </div>
      </div>
      <div key="sidebar__search" className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Start a new chat" type="text" />
        </div>
      </div>
      <div key="sidebar__chats" className="sidebar__chats">
        <SidebarChat user={user} addNewChat={true} />
        {groups.map((g) => (
          <div onClick={() => getGrpMessages(g._id)}>
            <SidebarChat user={user} name={g.name} key={g._id} id={g._id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
