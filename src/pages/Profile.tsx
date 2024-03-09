import React, { useState, ChangeEvent } from "react";
import { Form, Button, Alert } from "react-bootstrap";
// import BackgroundImage from "../assets/background.png";
import profileImg from "../assets/profile.png";

interface UserData {
  _id: string;
  accessToken: string;
  refreshToken: string;
  email: string;
}

const Register = () => {
  const user: UserData = JSON.parse(localStorage.getItem("user"));

  const [inputEmail, setInputEmail] = useState(user.email);
  const [inputPassword, setInputPassword] = useState("12345678");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(
    "http://localhost:3000/public/${profileImageName}"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileImageName = JSON.parse(
    localStorage.getItem("user")
  ).profileImage;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Validate email and password (omitted for brevity)

    setLoading(true);

    // Logic for handling image upload (omitted for brevity)

    setLoading(false);
    setIsEditing(false); // Exit editing mode after successful submission
    window.location.reload();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setSelectedImage(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="login">
      <div className="myWrapper">
        <div className="center">
          <div className="line" />
        </div>
        <div className="details">
          <h1>Profile</h1>
          <input
            type="text"
            placeholder="Email"
            className="custom-input"
            style={{ borderRadius: "10px" }}
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            readOnly={true}
          />
          <input
            type={isEditing ? "text" : "password"}
            placeholder="Password"
            className="custom-input mb-3"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            readOnly={!isEditing}
          />
          <img
            src={
              isEditing
                ? imagePreview
                : `http://localhost:3000/public/${profileImageName}`
            }
            alt="User Profile Image"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              marginBottom: "20px",
              width: "100%",
              height: "auto",
            }}
          />
          {isEditing && (
            <>
              <label htmlFor="profile-image" className="btn btn-outline-dark">
                Choose Profile Image
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="custom-input"
                style={{
                  visibility: "hidden",
                  width: "0px",
                  height: "0px",
                  padding: "0px",
                }}
                onChange={handleImageChange}
              />
            </>
          )}
        </div>
        <div className="left">
          {isEditing ? (
            <button
              className="loginButton adLogin bg-warning"
              onClick={handleSubmit}
            >
              Save
            </button>
          ) : (
            <button
              className="loginButton adLogin bg-warning"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
