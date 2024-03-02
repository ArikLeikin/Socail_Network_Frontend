import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/background.png";
import Logo from "../assets/logo.png";
import Google from "../assets/google.png";
import Facebook from "../assets/facebook.png";
import Github from "../assets/github.png";

const Login = ({ handleLogin }) => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  const facebook = () => {
    window.open("http://localhost:5000/auth/facebook", "_self");
  };

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("tokens")
  );

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const requestBody = {
      email: inputEmail,
      password: inputPassword,
    };

    try {
      // Step 1: Login
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const loginData = await response.json();

        // Step 2: Get User Info
        const userDataResponse = await fetch(
          "http://localhost:3000/auth/getUserInfo",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${loginData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userDataResponse.ok) {
          const userData = await userDataResponse.json();

          localStorage.setItem("tokens", JSON.stringify(loginData));
          localStorage.setItem("user", JSON.stringify(userData));

          console.log("Login successful!");
          handleLogin();
          navigate("/home");
        } else {
          console.log("Failed to get user information");
          setShow(true);
        }
      } else {
        console.log("Login failed!");
        setShow(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    // Redirect or perform any other actions after logout
  };

  const handlePassword = () => {};

  function delay(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className="login">
      <div className="myWrapper">
        <div className="center">
          <div className="line" />
          {/* <div className="or">OR</div> */}
        </div>
        <div className="details">
          <h1>Login to AD Social</h1>
          <input
            type="text"
            placeholder="Email"
            className="custom-input"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            style={{ borderRadius: "10px" }}
          />
          <input
            type="text"
            placeholder="Password"
            className="custom-input mb-3"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />
        </div>
        <div className="left">
          <button className="loginButton adLogin" onClick={handleSubmit}>
            Login
          </button>
          <div className="loginButton google" onClick={google}>
            <img src={Google} alt="" className="icon" />
            Google
          </div>
          <div className="loginButton facebook" onClick={facebook}>
            <img src={Facebook} alt="" className="icon" />
            Facebook
          </div>
          <div className="register">
            <span className="mx-1">New user?</span>
            <a href="/register">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
