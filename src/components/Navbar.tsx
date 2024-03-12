import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Container } from "react-bootstrap";
import BootstrapNavbar  from "react-bootstrap/Navbar";

interface User {
  displayName: string;
  photos: { value: string }[];
}

interface NavbarProps {
  user?: User | null;
}


const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [userData, setUserData] = useState<User | null>(user);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const logout = async () => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    await fetch("http://localhost:3000/auth/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    setUserData(null);
    navigate("/");
  };

  const renderLoggedInLinks = () => (
    <>
      <span className="user-details">{userData?.displayName}</span>
      <Link className="link" to="/" onClick={logout}>
        Logout
      </Link>
    </>
  );

  const renderLoggedOutLink = () => (
    <Link className="link" to="/" onClick={handleLoginClick}>
      Login
    </Link>
  );

  const handleLoginClick = () => {
    const tokens = localStorage.getItem("tokens");
    const storedUser = localStorage.getItem("user");

    if (tokens && storedUser) {
      // If both tokens and user data exist, the user is logged in, navigate to /home
      navigate("/home");
    }
  };

  return (
    <BootstrapNavbar bg="dark" data-bs-theme="dark">
        <Container>
          <BootstrapNavbar.Brand href="/">AD Social</BootstrapNavbar.Brand>
         
            {userData ? renderLoggedInLinks() : renderLoggedOutLink()}
          
        </Container>
      </BootstrapNavbar>
  );
};

export default Navbar;
