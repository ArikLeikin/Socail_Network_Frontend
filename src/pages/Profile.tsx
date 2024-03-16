import React, { useState, ChangeEvent, useEffect } from "react";
import { editPassword } from "../utils/edit-password";
import { editImage } from "../utils/edit-image";
export interface UserData {
  _id: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  profileImage: string;
  password: string;
}

const Profile = () => {
  const user: UserData = JSON.parse(localStorage.getItem("user"));
  const [inputEmail, setInputEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userGoogle, setUserGoogle] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const profileImageName = JSON.parse(
    localStorage.getItem("user")
  ).profileImage;
  const [imagePreview, setImagePreview] = useState(`http://localhost:3000/public/${profileImageName}`);
  const [isEditing, setIsEditing] = useState(false);
  // const [,setShow] = useState(false);
  const [,setLoading] = useState(false);

    
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
        console.log("storedUser",storedUser);
        
      if (storedUser) {
        const parsedUser: UserData = JSON.parse(storedUser);
        localStorage.setItem('profileImage', parsedUser.profileImage);
        if(parsedUser.password.length < 6){
          setUserGoogle(true);
        }     
        setCurrentPassword(parsedUser.password);
        
        if(parsedUser.profileImage){
          if(parsedUser.profileImage.includes("googleusercontent")){
            setImagePreview(parsedUser.profileImage);
          }
          else {
            setImagePreview(`http://localhost:3000/public/${parsedUser.profileImage}`);
           
          }
        }
      }
    }, [profileImageName,currentPassword,user.password,user.profileImage]);




  const handleEdit = () => {
    setIsEditing(true);
  };
 



  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log("Submit");
    // Validate email and password (omitted for brevity)
    setLoading(true);
    setIsEditing(true);
    if (newPassword.length >=6) {
        const newPasswordUser =   await editPassword(user,setLoading,currentPassword,newPassword);
      if(newPasswordUser){
        console.log("newPasswordUser",newPasswordUser);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        storedUser.password = newPasswordUser;
        localStorage.setItem("user", JSON.stringify(storedUser));
          setCurrentPassword(newPasswordUser);
          setNewPassword("");
      }
   
    }

    if (selectedImage) {
      const editedImage =  await editImage(user,setLoading,selectedImage);
      if(editedImage){
        console.log("editedImage",editedImage);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        storedUser.profileImage = editedImage;
        console.log("storedUser",storedUser);
        
        localStorage.setItem("user", JSON.stringify(storedUser));
        setImagePreview(`http://localhost:3000/public/${editedImage}`);
        window.location.reload();
      }
    }
    setLoading(false);
    setIsEditing(false); // Exit editing mode after successful submission
  };

  // const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setCurrentPassword(event.target.value);
    
  // };


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
    {!userGoogle && (
  <>
    <input
      type={isEditing ? "text" : "password"}
      placeholder="Password"
      className="custom-input mb-3"
      value={currentPassword}
      readOnly={true}
    />
    {isEditing &&  (
      <input
        type={isEditing ? "text" : "password"}
        placeholder="New Password"
        className="custom-input mb-3"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    )}
  </>
)}
            
          <img
            src={
              imagePreview
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
          {(isEditing && newPassword == "") && (
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
