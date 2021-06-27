import React from "react";
import { Button } from "@material-ui/core";
import "./Login.css";

function Login({ setUser }) {
  const signIn = () => {};
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://i.pinimg.com/originals/f7/5d/94/f75d94874d855a7fcfcc922d89ac5e80.png"
          alt="Img not fount"
        />
        <div className="login__text">
          <h1>Sign in to Whatsapp</h1>
        </div>
        <Button onClick={signIn}>Sign In</Button>
      </div>
    </div>
  );
}

export default Login;
