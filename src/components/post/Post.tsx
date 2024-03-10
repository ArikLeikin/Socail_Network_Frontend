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

const Post = ({ post }) => {
  let userEmail = null;
  const user = JSON.parse(localStorage.getItem("user"));
  const [showComments, setShowComments] = useState(false);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const getFormattedDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options = { hour: "numeric", minute: "numeric", hour12: false };
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
      console.log("111111111");
      console.log(response);
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

  useEffect(() => {
    fetchUserForPost(post.id, post.user);
  }, [post.id, post.user]);

  return (
    <div
      className="myWrapper mt-5"
      key={post.id}
      style={{ overflowWrap: "break-word" }}
    >
      <div className="center"></div>
      <div className="post-wrapper d-flex flex-column align-items-center">
        <div className="d-flex flex-column align-items-center mt-2">
          <h6>{users[post.user]?.email}</h6>
          <h6>{getFormattedDateTime(post.createdAt)}</h6>
        </div>
        <hr />
        <p className="mt-2">{post.body}</p>
        {post.picture && (
          <img
            src={"http://localhost:3000/public/" + post.picture}
            alt=""
            className="mb-2"
            style={{ maxWidth: "100%", height: "600px" }}
          />
        )}
      </div>
      <hr />
      <div
        className="d-flex mt-1 mb-1 justify-content-evenly"
        style={{ width: "100%" }}
      >
        <Likes post={post} />
        <Comments post={post} />
      </div>
    </div>
  );
};

export default Post;
