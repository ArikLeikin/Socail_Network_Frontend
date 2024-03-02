import React, { useState } from "react";
import { Form, Button, Image as BootstrapImage } from "react-bootstrap";
import { Image as ImageIcon } from "react-bootstrap-icons";
import "./addPost.css";
import profileImg from "../../assets/profile.png"; // Replace with the correct path

interface AddPostProps {
  onAddPost: (newPost: {
    id: number;
    title: string;
    body: string;
    image?: File;
  }) => void;
}

const AddPost: React.FC<AddPostProps> = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];

    if (selectedImage) {
      setImage(selectedImage);

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
      // Check if required fields are filled
      if (!title || !body) {
        alert("Title and Body are required fields");
        return;
      }

      // Create a JSON object representing the post data
      const postData = {
        title,
        body,
      };

      // If an image is selected, add it to the JSON object
      if (image) {
        postData["file"] = image;
      }

      // Make a POST request to your backend endpoint
      const response = await fetch("http://localhost:3000/posts/addPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any necessary headers, such as authorization
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newPost = await response.json();
        // Assuming you have a function to update the state with the new post
        onAddPost(newPost);

        // Clear form fields and image preview
        setTitle("");
        setBody("");
        setImage(null);
        setImagePreview(null);
        setInputKey((prevKey) => prevKey + 1);

        alert("Post created successfully!");
      } else {
        alert("Error creating post");
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
        controlId="formBody"
        className="d-flex flex-column align-items-center mt-1 postBody"
        style={{ width: "100%" }}
      >
        <Form.Control
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
    </Form>
  );
};

export default AddPost;
