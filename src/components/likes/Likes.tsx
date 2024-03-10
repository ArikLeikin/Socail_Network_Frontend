import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Likes = ({ post }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length); // Initialize like count

  const handleLike = async () => {
    console.log(post._id);
    console.log(user.email);

    try {
      const response = await fetch(
        `http://localhost:3000/posts/${post._id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        }
      );
      if (response.ok) {
        setLiked(true);
        setLikeCount(likeCount + 1);
      } else {
        toast.error("Error liking the post!");
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      toast.error("Error liking the post!");
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${post._id}/like`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        }
      );
      if (response.ok) {
        setLiked(false);
        setLikeCount(likeCount - 1); // Decrement like count
      } else {
        toast.error("Error unliking the post!");
      }
    } catch (error) {
      console.error("Error unliking the post:", error);
      toast.error("Error unliking the post!");
    }
  };

  return (
    <>
      <a
        className="link-opacity-75 link-opacity-100-hover link-underline-light"
        onClick={liked ? handleUnlike : handleLike}
      >
        Likes: {likeCount}
      </a>
    </>
  );
};

export default Likes;
