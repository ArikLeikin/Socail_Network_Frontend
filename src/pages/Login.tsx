import React, { useState } from "react";
// import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import { useNavigate } from "react-router-dom";
// import BackgroundImage from "../assets/background.png";
// import Logo from "../assets/logo.png";
// import Google from "../assets/google.png";
// import Facebook from "../assets/facebook.png";
// import Github from "../assets/github.png";
import { ToastContainer } from "react-toastify";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import AuthNavbar from "../components/AuthNavbar";
// import AuthNavbar from "../components/Navbar";

const Login = ({ handleLogin }) => {
  // const google = () => {
  //   window.open("http://localhost:5000/auth/google", "_self");
  // };

  // const facebook = () => {
  //   window.open("http://localhost:5000/auth/facebook", "_self");
  // };

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [, setShow] = useState(false);
  const [, setLoading] = useState(false);
   const [loggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

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
        
        localStorage.setItem("user", JSON.stringify(loginData));

        console.log("Login successful!");
        handleLogin();
        navigate("/home");
      } else {
        console.log("Failed to get user information");
        setShow(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };



  async function googleResponse(credentialResponse: CredentialResponse): Promise<void> {
    const response = await fetch("http://localhost:3000/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentialResponse),
    });
    
    if (response.ok) {
      const loginData = await response.json();
      localStorage.setItem("user", JSON.stringify(loginData));
      const user = JSON.parse(localStorage.getItem("user"));
      // console.log("user-login", user);
      
      setUser(user);
      user.profileImage = loginData.profileImage;
      // console.log("user image", user.profileImage);
      setIsLoggedIn(true);
      console.log("Login successful!");
      handleLogin();
      navigate("/home");
    } else {
      console.log("response auth google", response);
      console.log("Failed to get user information");
      setShow(true);
    }
  }

  function googleErrorResponse(): void {
    throw new Error("Function not implemented.");
  }

  // const handleLogout = () => {
  //   localStorage.removeItem("tokens");
  //   localStorage.removeItem("user");
  //   setIsLoggedIn(false);
  //   // Redirect or perform any other actions after logout
  // };

  // const handlePassword = () => {};

  // function delay(ms: number | undefined) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  return (
    <div className="login">
      <div className="myWrapper">
        <div className="center">
          <div className="line" />
        </div>
        <div className="details">
          <h1>Login to AD Social</h1>
          <input
            type="email"
            placeholder="Email"
            className="custom-input"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            style={{ borderRadius: "10px" }}
          />
          <input
            type="password"
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
             
            <GoogleLogin
          onSuccess={googleResponse}
          onError={googleErrorResponse}
          />
          {loggedIn && <AuthNavbar user={user} handleLogout={() => {localStorage.removeItem("user"); setIsLoggedIn(false);} }/>}

       
          <div className="register">
            <span className="mx-1">New user?</span>
            <a href="/register">Register</a>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Login;
