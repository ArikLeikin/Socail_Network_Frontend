import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  displayName: string;
  photos: { value: string }[];
}

interface AuthNavbarProps {
  user?: User | null;
  handleLogout: () => void;
}

const AuthNavbar: React.FC<AuthNavbarProps> = ({ user, handleLogout }) => {
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
    const response = await fetch("http://localhost:3000/auth/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
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
        <Link className="link" to="/">
          AD Social
        </Link>
      </span>
      <Link className="link" to="/" onClick={logout}>
        Logout
      </Link>
    </div>
  );
};

export default AuthNavbar;
