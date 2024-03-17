import React, { useState } from "react";
import { Form, Button, Image as BootstrapImage } from "react-bootstrap";
import { Image as ImageIcon } from "react-bootstrap-icons";
import "./addPost.css";
// import profileImg from "../../assets/profile.png"; // Replace with the correct path
import { ToastContainer, toast } from "react-toastify";

interface AddPostProps {
  onAddPost: (newPost: { _id: number; body: string; image?: File }) => void;
}

const AddPost: React.FC<AddPostProps> = ({ onAddPost }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const[selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];

    if (selectedImage) {
      setImage(selectedImage);
      setSelectedFile(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);

      // Increment inputKey to trigger re-render of the file input
      setInputKey((prevKey) => prevKey + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(body);

      // Check if required fields are filled
      if (!body) {
        toast.error("Body is required");
        return;
      }

      // Create a FormData object
      const formData = new FormData();
      formData.append("body", body);
      if (image) {
        formData.append("file", image);
      }
      const accessToken = JSON.parse(localStorage.getItem("user")).accessToken;
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      formData.append("user", userId);
      // Make a POST request to your backend endpoint
      const response = await fetch("http://localhost:3000/posts/addPost", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newPost = await response.json();
        // Assuming you have a function to update the state with the new post
        onAddPost(newPost);

        // Clear form fields and image preview
        setBody("");
        setImage(null);
        setImagePreview(null);
        setInputKey((prevKey) => prevKey + 1);
        console.log(response);

        toast.success("Post created successfully!");
      } else {
        toast.error("Error creating post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setInputKey((prevKey) => prevKey + 1);
  };

  return (
    <Form onSubmit={handleSubmit} className="myWrapper mt-5">
      <h4 className="mt-2">Create Post</h4>
      <hr />
      <Form.Group
        className="d-flex flex-column align-items-center mt-1 postBody"
        style={{ width: "100%" }}
      >
        <Form.Control
          key={"create"}
          as="textarea"
          rows={3}
          className="p-0" // Added margin on top and bottom
          style={{ width: "90%" }}
          placeholder="Share your thoughts"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {imagePreview && (
          <div className="position-relative">
            <BootstrapImage
              key={"createImage"}
              src={imagePreview}
              alt="Selected Image"
              className="mt-2 mb-2"
              style={{ maxWidth: "100%", maxHeight: "50%" }}
            />
          </div>
        )}
        <div className="d-flex flex-column align-items-center mt-2">
          <div className="d-flex mt-2">
            {" "}
            {/* Added margin top */}
            <label htmlFor="formImage" className="btn btn-outline-dark mr-2">
              <ImageIcon /> Choose Image
            </label>
            {imagePreview && (
              <Button variant="danger" onClick={handleRemoveImage}>
                <span aria-hidden="true">&times;</span>
              </Button>
            )}
          </div>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="formImage"
            key={inputKey}
          />
        </div>
      </Form.Group>

      <Button className="mt-2 mb-2" variant="primary" type="submit">
        Post
      </Button>
      <ToastContainer />
    </Form>
  );
};

export default AddPost;
