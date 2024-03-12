import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Container, Nav, NavDropdown } from "react-bootstrap";
import BootstrapNavbar  from "react-bootstrap/Navbar";
const URL = "http://localhost:3000";

interface User {
  email: string;
  displayName: string;
  photo: string;
}

interface AuthNavbarProps {
  user?: User | null;
  handleLogout: () => void;
  profile;
}

interface UserData {
  _id: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  profileImage: string;
}

const AuthNavbar: React.FC<AuthNavbarProps> = ({ user, handleLogout }) => {
  const [userData, setUserData] = useState<User | null>(user);
  const [profileImage, setProfileImage] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: UserData = JSON.parse(storedUser);
      setUserData(JSON.parse(storedUser));
      if (parsedUser.profileImage) {
        setProfileImage(URL + `/public/${parsedUser.profileImage}`);
      }
    }
  }, []);

  const logout = async () => {
    const userData: UserData = JSON.parse(localStorage.getItem("user"));
   await fetch("http://localhost:3000/auth/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    setUserData(null);
    handleLogout();
    navigate("/");
  };

  

      return (
        <BootstrapNavbar collapseOnSelect expand="lg" className="navbar navbar-expand navbar-light bg-dark">
          <Container>
            <BootstrapNavbar.Brand> < Link to="/" className="nav-link">Social AD</Link></BootstrapNavbar.Brand>
            
            <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
            <BootstrapNavbar.Collapse id="responsive-navbar-nav">
              {userData && (
                <>
              <Nav className="me-auto">
              <Nav.Link href="/news" className="nav-link">News</Nav.Link>
                <Nav.Link className="nav-link">Posts</Nav.Link>
                <Nav.Link className="nav-link">Comments</Nav.Link>
              </Nav>
              <Nav>
                <div className="image-wrapper">
                <img className="profile-image" alt="profile-pic"
                src={profileImage}
              
                />
                </div>
              <NavDropdown title="Profile User" className="link" id="collapsible-nav-dropdown">
                  <NavDropdown.Item href ="/user-posts">Posts</NavDropdown.Item>
                  <NavDropdown.Item href ="/user-comments">Comments</NavDropdown.Item>
                  <NavDropdown.Item href="/profile" className="link">Edit</NavDropdown.Item>
              </NavDropdown>
                <Nav.Link className="nav-link" onClick={logout}><Link to="/" className="link">Logout</Link></Nav.Link>
                <Nav.Link className="nav-link" eventKey={2}>
                 Settings
                </Nav.Link>
              </Nav>
              </>
              )}
            </BootstrapNavbar.Collapse>
          </Container>
        </BootstrapNavbar>
      );
    
};

export default AuthNavbar;
