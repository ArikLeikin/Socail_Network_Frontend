import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profileImg from "../assets/profile.png";
import SERVER_URL from "../config"

const Register = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(profileImg);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Validate email
    if (!validateEmail(inputEmail)) {
      alert("Invalid email format");
      return;
    }

    // Validate password
    if (!validatePassword(inputPassword)) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        email: inputEmail,
        password: inputPassword,
      };

      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();


      if (response.ok) {
        // Registration successful
        const pictureFormData = new FormData();
        pictureFormData.append("file", selectedImage);
        const userId = responseData._id;
        if (selectedImage) {
          const response = await fetch(
            `${SERVER_URL}/user/picture/${userId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${responseData.accessToken}`,
              },
              body: pictureFormData,
            }
          );

          if (response.ok) {
            console.log("Image uploaded successfully");

          }
        }
        navigate("/");

      } else {
        // Handle registration failure
        if (response.status === 409) {
          toast.error("Email already in use");
        } else {
          toast.error("Registration failed!");
        }
        console.error("Registration failed");
        setShow(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setShow(true);
    }

    setLoading(false);
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

  const validateEmail = (email: string) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Basic password validation (at least 6 characters)
    return password.length >= 6;
  };


  return (
    <div className="login">
      <div className="myWrapper">
        <div className="center">
          <div className="line" />
        </div>

        <div className="details">
          <h1>Register to AD Social</h1>
          <input
            type="text"
            placeholder="Email"
            className="custom-input"
            style={{ borderRadius: "10px" }}
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="custom-input mb-3"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />

          <label htmlFor="profile-image" className="btn btn-outline-dark">
            Select Profile Image
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

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                marginBottom: "20px",
                width: "100%",
                height: "auto",
              }}
            />
          )}
        </div>
        <div className="left">
          <button className="loginButton adLogin" onClick={handleSubmit}>
            Submit
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Register;
