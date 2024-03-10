import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "../assets/profile.png";
import "bootstrap/dist/css/bootstrap.min.css";

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
    const response = await fetch("http://localhost:3000/auth/logout", {
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
    <div className="myNavbar">
      <span className="logo">
        <Link className="link mx-2" to="/">
          AD Social
        </Link>
        <Link
          className="link-underline link-underline-opacity-0 link-opacity-75"
          to="/news"
        >
          News
        </Link>
      </span>

      <div className="d-flex">
        {userData && (
          <div className="profile-info">
            <Link to="/profile">
              <img
                src={profileImage}
                style={{ maxWidth: "25px", maxHeight: "25px" }}
              />
              <span className="display-name mx-3">{userData.email}</span>
            </Link>
          </div>
        )}

        <Link className="link" to="/" onClick={logout}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default AuthNavbar;
