import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import AuthNavbar from "./components/AuthNavbar";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";
import News from "./pages/News";
import { Navigate } from "react-router-dom";
import UserPosts from "./pages/UserPosts";
import UserComments from "./pages/UserComments";

interface User {
  _id: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  profileImage: string; // Add profileImage field
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // const handleProfileChange = (newProfileData: User) => {
  //   setProfile(newProfileData);
  //   setIsLoggedIn(!!newProfileData); // Update isLoggedIn based on profile data
  // };

  useEffect(() => {
    const validateAccessToken = async () => {
      try {
        const user: User | null = JSON.parse(
          localStorage.getItem("user") || "null"
        );
        if (user) {
          // Make a request to the server to validate the access token
          // Replace the following line with your actual API endpoint for token validation
          const response = await fetch(`/user/${user._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          });

          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error validating access token:", error);
        setIsLoggedIn(false);
      }
    };

    validateAccessToken();
  }, []);

  return (
    <Router>
      {isLoggedIn ? (
        <AuthNavbar profile={profile} handleLogout={handleLogout} />
      ) : (
        <Navbar />
      )}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/news" element={<News />} />
            <Route path="/UserPosts" element={<UserPosts />} />
            <Route path="/UserComments" element={<UserComments />} />
            
          </>
        ) : (
          <>
            <Route path="/" element={<Login handleLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
