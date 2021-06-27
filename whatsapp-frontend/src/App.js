import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Signup from "./Signup";
import SignIn from "./SignIn";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [signIn, setSignIn] = useState(false);

  /* useEffect(() => {
    axios.get("message/sync").then((response) => {
      setMessages(response.data);
    });
  }, []); */
  /* useEffect(() => {
    const pusher = new Pusher("90ec4a66a548dfb8f613", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("appChanges");
    channel.bind("messagesInsert", function (newMessage) {
      setMessages([...messages, newMessage]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]); */
  return (
    <div className="app">
      {!user ? (
        signIn ? (
          <SignIn setSignIn={setSignIn} setUser={setUser} />
        ) : (
          <Signup setUser={setUser} setSignIn={setSignIn} />
        )
      ) : (
        <div className="app__body">
          <Router>
            <Switch>
              <Route path="/rooms/:roomId">
                <Sidebar
                  key={"sidebar_with_roomId"}
                  user={user}
                  setUser={setUser}
                  setMessages={setMessages}
                />
                <Chat
                  user={user}
                  messages={messages}
                  setMessages={setMessages}
                />
              </Route>
              <Route exact path="/">
                <Sidebar
                  key={"sidebar_without_roomId"}
                  user={user}
                  setMessages={setMessages}
                  messages={messages}
                  setUser={setUser}
                />
                {/* <Chat messages={messages} /> */}
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
