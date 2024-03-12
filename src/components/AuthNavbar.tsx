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

export interface UserData {
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
    console.log("storedUser", storedUser);
   
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
            <div> < Link to="/" className="nav-link">Social AD</Link></div>
            
            <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
            <BootstrapNavbar.Collapse id="responsive-navbar-nav">
              {userData && (
                <>
              <Nav className="me-auto">
             
                <Link to="/news" className="nav-link">
                News
                </Link>
                <Link to="/news" className="nav-link">
                Posts
                </Link>
                <Link to="/news" className="nav-link">
                Comments
                </Link>
              </Nav>
              <Nav>
                <div className="image-wrapper">
                <img className="profile-image" alt="profile-pic"
                src={profileImage}
              
                />
                </div>
              <NavDropdown title="Profile User" className="link" id="collapsible-nav-dropdown">
                  <NavDropdown.Item as="div">
                    <Link to={`/UserPosts`} className="link">
                      Posts                                 
                    </Link>               
                    </NavDropdown.Item>
                  <NavDropdown.Item as="div">
                    <Link to={`/UserComments`} className="link">
                    Comments
                    </Link>
                    </NavDropdown.Item>
                  <NavDropdown.Item as="div">
                    <Link to={`/profile`} className="link">
                    Edit
                    </Link>
                    </NavDropdown.Item>
              </NavDropdown>
                <Nav className="nav-link" onClick={logout}>
                  <Link to="/" className="link">Logout
                  </Link>
                  </Nav>
                <Nav className="nav-link">
                 Settings
                </Nav>
              </Nav>
              </>
              )}
            </BootstrapNavbar.Collapse>
          </Container>
        </BootstrapNavbar>
      );
    
};

export default AuthNavbar;
