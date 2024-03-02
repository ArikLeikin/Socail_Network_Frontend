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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Check if there is an access token in local storage
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken); // Set isLoggedIn to true if accessToken exists
  }, []);

  return (
    <Router>
      {isLoggedIn ? <AuthNavbar handleLogout={handleLogout} /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
