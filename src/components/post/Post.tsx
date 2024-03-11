import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./post.css";
import profileImg from "../../assets/profile.png";
import bg from "../../assets/background.png";
import likeIcon from "../../assets/like-icon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Likes from "../likes/Likes";
import Comments from "../comments/Comment";
import AddComment from "../comments/AddComment";

interface PostData {
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

type Props = {
  renderHome: () => void;
};

const Post = ({ post, renderHome }) => {
  let userEmail = null;
  const user = JSON.parse(localStorage.getItem("user"));
  const [showComments, setShowComments] = useState(false);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const [postComments, setPostComments] = useState<string[]>(post.comments);
  const [isEditable, setEditable] = useState(false);
  // State variables to manage editable content
  const [editableBody, setEditableBody] = useState(post.body);
  const [editablePicture, setEditablePicture] = useState(post.picture);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

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
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (response.ok) {
        const userData: UserData = await response.json();
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData }));
      } else {
        toast.error("Error fetching user data!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCommentAdded = (comment) => {
    console.log(comment);
    setPostComments([...postComments, comment]);
    renderHome();
  };

  // Function to handle editing the post
  const handleEditPost = () => {
    setEditable(!isEditable);
  };

  // Function to handle file input change
  const handleImageChange = async (event) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const form = new FormData();
    form.append("file", event.target.files[0]);
    form.append("user", user._id);
    form.append("body", editableBody);

    const response = await fetch(
      `http://localhost:3000/posts/${post._id}/update`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        body: form,
      }
    );

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditablePicture(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchUserForPost(post.id, post.user);
  }, [post.id, post.user, postComments]);

  const handleChange = (event) => {
    setEditableBody(event.target.value);
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
        {/* Render editable body and picture */}
        {isEditable ? (
          <input
            type="text"
            value={editableBody}
            className="form-control mx-2"
            onChange={handleChange}
            placeholder="edit body"
          />
        ) : (
          <p className="mt-2">{editableBody}</p>
        )}
        {!isEditable && editablePicture && (
          <img
            src={"http://localhost:3000/public/" + editablePicture}
            alt=""
            className="mb-2"
            style={{ maxWidth: "100%", height: "400px" }}
          />
        )}
        {isEditable && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control-file"
          />
        )}
      </div>
      <hr />
      <div
        className="d-flex mt-1 mb-1 justify-content-evenly"
        style={{ width: "100%" }}
      >
        <Likes post={post} key={1} />
        <Comments post={post} key={2} />
        {user && user._id === post.user && (
          <button
            type="button"
            className="btn btn-light px-0 py-0"
            onClick={handleEditPost}
          >
            Edit Post
          </button>
        )}
      </div>
      <hr />
      <div className="d-flex justify-content-center" style={{ width: "100%" }}>
        <AddComment post={post} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
};

export default Post;
