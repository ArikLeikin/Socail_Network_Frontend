import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./post.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Likes from "../likes/Likes";
import AddComment from "../comments/AddComment";
import { Form, Button, Image as BootstrapImage } from "react-bootstrap";
import { Link } from "react-router-dom";
import SERVER_URL from "../../config"

const toastConfiguration = {
  autoClose: 750, // Adjust auto close duration to 0.75 seconds
  draggable: false, // Disable dragging to dismiss
};

export interface PostData {
  id: number;
  title: string;
  user: string;
  body: string;
  picture: string;
  createdAt: Date;
  likes: string[];
  comments: string[];
}

interface UserData {
  email: string;
}


const Post = ({ post, renderHome }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const [postComments, setPostComments] = useState<string[]>(post.comments);
  const [isEditable, setEditable] = useState(false);
  // State variables to manage editable content
  const [editableBody, setEditableBody] = useState(post.body);
  const [editablePicture, setEditablePicture] = useState<File | null>(null); // Change to accept File objects
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const getFormattedDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric", // or "2-digit"
      minute: "numeric", // or "2-digit"
      hour12: false,
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const fetchUserForPost = async (postId: number, userId: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (response.ok) {
        const userData: UserData = await response.json();
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData }));
      } else {
        toast.error("Error fetching user data!", toastConfiguration);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCommentAdded = (comment) => {

    setPostComments([...postComments, comment]);
    renderHome();
  };

  // Function to handle editing the post
  const handleEditPost = (post: PostData) => {

    setSelectedImage(post.picture);
    setEditable(!isEditable);
  };

  // Function to handle file input change
  const handleImageChange = async (event) => {
    const file = event.target.files[0];


    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setEditablePicture(file);
    }
  };

  useEffect(() => {
    fetchUserForPost(post.id, post.user);
  }, [post.id, post.user, isEditable, postComments, editablePicture, selectedImage]);

  const handleRemoveImage = async () => {
    const postId = post._id;

    const response = await fetch(`${SERVER_URL}/posts/${postId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        picture: null,
      }),
    });
    if (response.ok) {
      setEditablePicture(null);
      setSelectedImage(null);
      toast.success("Image removed", toastConfiguration);
      renderHome();
    } else {
      toast.error("Error removing image", toastConfiguration);
    }


    setEditablePicture(null);
  };

  const handleSavePost = async () => {
    try {
      const formData = new FormData();
      formData.append("body", editableBody);
      if (editablePicture) {
        formData.append("file", editablePicture);
      }
      const accessToken = JSON.parse(localStorage.getItem("user")).accessToken;
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      formData.append("user", userId);

      // Make a POST request to your backend endpoint
      const response = await fetch(
        `${SERVER_URL}/posts/${post._id}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setEditable(false);
        toast.success("Updated Post Successfuly", toastConfiguration);
        renderHome();
      } else {
        toast.error("Error creating post", toastConfiguration);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post");
    }
  };

  const handleDeletePost = async () => {
    try {
      const postId = post._id;
      const accessToken = JSON.parse(localStorage.getItem("user")).accessToken;

      const response = await fetch(`${SERVER_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        renderHome();
        toast.success("Deleted Post", toastConfiguration);
      } else {
        toast.error("Error Deleting Post", toastConfiguration);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post");
    }
  };

  return (
    <div
      className="myWrapper mt-5"
      key={post.id}
      style={{ overflowWrap: "break-word" }}
    >
      <div className="center"></div>
      <div
        className="post-wrapper d-flex flex-column align-items-center"
        style={{ width: "100%" }}
      >
        <div className="d-flex flex-column align-items-center mt-2">
          <h6>{users[post.user]?.email}</h6>
          <h6>{getFormattedDateTime(post.createdAt)}</h6>
        </div>
        <hr />

        {!isEditable ? (
          <div className="d-flex flex-column">
            <p className="mt-2">{editableBody}</p>
            {post.picture && (
              <img
                src={`${SERVER_URL}/public/${post.picture}`}
                alt=""
                className="mb-2"
                style={{ maxWidth: "100%", height: "400px" }}
              />
            )}
          </div>
        ) : (
          <Form style={{ width: "100%" }}>
            <hr />
            <Form.Group
              className="d-flex flex-column align-items-center mt-1 postBody"
              style={{ width: "100%" }}
            >
              <Form.Control
                key={"1"}
                as="textarea"
                rows={3}
                className="p-0" // Added margin on top and bottom
                style={{ width: "90%" }}
                placeholder="Share your thoughts"
                value={editableBody}
                onChange={(e) => setEditableBody(e.target.value)}
              />
              {selectedImage && (
                <div className="position-relative">
                  <BootstrapImage
                    src={editablePicture ? URL.createObjectURL(editablePicture) : selectedImage ? `${SERVER_URL}/public/${selectedImage}` : null}
                    alt="Selected Image"
                    className="mt-2 mb-2"
                    style={{ maxWidth: "100%", maxHeight: "50%" }}
                  />
                </div>
              )}
              <div className="d-flex  align-items-center mt-2 my-2">
                <Form.Control
                  className="mx-2"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="formImage"
                />
                <div className="d-flex">

                  <Button variant="danger" onClick={() => handleRemoveImage()} className="removeImageBtn">
                    <span aria-hidden="true">X</span>

                  </Button>


                </div>
              </div>
            </Form.Group>
            <ToastContainer />
          </Form>
        )}
      </div>
      <hr />
      <div
        className="d-flex mt-1 mb-1 justify-content-evenly"
        style={{ width: "100%" }}
      >
        <Link
          to={`/comments/${post._id}`}
          className="link-opacity-75 link-opacity-100-hover link-underline-light"
        >
          Comments: {post.comments.length}
        </Link>

        <Likes post={post} key={1} />
        {!isEditable && user && user._id === post.user ? (
          <>
            <button
              type="button"
              className="btn btn-light px-0 py-0"
              onClick={() => handleEditPost(post)}
            >
              Edit Post
            </button>
            <button
              type="button"
              className="btn btn-light px-0 py-0"
              onClick={handleDeletePost}
            >
              Delete Post
            </button>
          </>
        ) : (
          user._id === post.user && (
            <button
              type="button"
              className="btn btn-light px-0 py-0"
              onClick={handleSavePost}
            >
              Save Post
            </button>
          )
        )}
      </div>
      <hr />
      <div className="d-flex justify-content-center" style={{ width: "100%" }}>
        <AddComment
          post={post}
          onCommentAdded={handleCommentAdded}
          key={"addComment"}
        />
      </div>
    </div>
  );
};

export default Post;
