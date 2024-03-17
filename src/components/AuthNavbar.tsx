import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, NavDropdown } from "react-bootstrap";
import BootstrapNavbar from "react-bootstrap/Navbar";
const URL = "http://localhost:3000";

interface User {
  email: string;
  displayName: string;
  photo: string;
}

interface AuthNavbarProps {
  user?: User | null;
  handleLogout: () => void;
}

export interface UserData {
  _id: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  profileImage: string;
}

const AuthNavbar: React.FC<AuthNavbarProps> = ({ handleLogout }) => {
  const [userData, setUserData] = useState<User | null>();
  const [profileImage, setProfileImage] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: UserData = JSON.parse(storedUser);
      localStorage.setItem("profileImage", parsedUser.profileImage);
      // const profileImage = localStorage.getItem('profileImage');
      // console.log("parsedUser", parsedUser);

      setUserData(JSON.parse(storedUser));
      if (parsedUser.profileImage) {
        if (parsedUser.profileImage.includes("googleusercontent")) {
          setProfileImage(parsedUser.profileImage);
          // console.log("googleusercontent", profileImage);
        } else {
          setProfileImage(URL + `/public/${parsedUser.profileImage}`);
          // console.log("profileImage", profileImage);
        }
      }
    }
  }, [profileImage]);

  const logout = async () => {
    const userData: UserData = JSON.parse(localStorage.getItem("user"));
    await fetch("http://localhost:3000/auth/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.refreshToken}`,
        "Content-Type": "application/json",
      },
    });
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    localStorage.removeItem("profileImage");
    !profileImage && setProfileImage("");
    setUserData(null);
    handleLogout();
    navigate("/");
  };

  return (
    <BootstrapNavbar
      collapseOnSelect
      expand="lg"
      className="navbar navbar-expand navbar-light bg-dark"
    >
      <Container>
        <div>
          {" "}
          <Link to="/" className="nav-link">
            Social AD
          </Link>
        </div>

        <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BootstrapNavbar.Collapse id="responsive-navbar-nav">
          {userData && (
            <>
              <Nav className="mx-1 me-auto">
                <Link to="/news" className="nav-link">
                  News
                </Link>
              </Nav>
              <Nav>
                <div className="image-wrapper">
                  <img
                    className="profile-image"
                    alt="profile-pic"
                    src={profileImage}
                  />
                </div>
                <NavDropdown
                  title="Profile User"
                  className="link"
                  id="collapsible-nav-dropdown"
                >
                  <Link to={`/UserPosts`} className="link">
                    <NavDropdown.Item as="div">Posts</NavDropdown.Item>
                  </Link>
                  <Link to={`/UserComments`} className="link">
                    <NavDropdown.Item as="div">Comments</NavDropdown.Item>
                  </Link>
                  <Link to={`/profile`} className="link">
                    <NavDropdown.Item as="div">Edit</NavDropdown.Item>
                  </Link>
                </NavDropdown>
                <Nav className="nav-link" onClick={logout}>
                  <Link to="/" className="link">
                    Logout
                  </Link>
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
