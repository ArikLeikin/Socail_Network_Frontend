import React, { useState, ChangeEvent } from "react";
import { editPassword } from "../utils/edit-password";
import { editImage } from "../utils/edit-image";
interface UserData {
  _id: string;
  accessToken: string;
  refreshToken: string;
  email: string;
}

const Profile = () => {
  const user: UserData = JSON.parse(localStorage.getItem("user"));
  const [inputEmail, setInputEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const profileImageName = JSON.parse(
    localStorage.getItem("user")
  ).profileImage;
  const [imagePreview, setImagePreview] = useState(
   ` http://localhost:3000/public/${profileImageName}`
  );
  const [isEditing, setIsEditing] = useState(false);
  const [,setShow] = useState(false);
  const [,setLoading] = useState(false);



  const handleEdit = () => {
    setIsEditing(true);
  };
 



  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log("Submit");
    // Validate email and password (omitted for brevity)
    setLoading(true);
    setIsEditing(true);
    if (currentPassword.length >=6 && newPassword.length >= 6) {
      await editPassword(user,setShow,setLoading,currentPassword,newPassword);
    }
    if (selectedImage) {
      await editImage(user,setShow,setLoading,selectedImage);
    }
    
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
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            readOnly={!isEditing}
          />
          {isEditing  && (
          <input
            type={isEditing ? "text" : "password"}
            placeholder="New Password"
            className="custom-input mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />)}
            
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

export default Profile;
