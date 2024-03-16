import React, { useEffect, useState } from "react";
import {  toast } from "react-toastify";

const Likes = ({ post }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [likeCount, setLikeCount] = useState(post.likes.length); // Initialize like count
  const [isLiked, setIsLiked] = useState(post.likes.includes(user.email)); // Check if the user has liked the post

  useEffect(() => {
    setIsLiked(post.likes.includes(user.email)); // Update isLiked state when post.likes changes
  }, [post.likes, user.email]);

  const handleToggleLike = async () => {
    try {
      const likeAction = isLiked ? "unlike" : "like"; // Determine the action based on isLiked state
      setIsLiked(post.likes.includes(user.email));
      const response = await fetch(
        `http://localhost:3000/posts/${post._id}/like`,
        {
          method: isLiked ? "DELETE" : "POST", // Use DELETE for unlike and POST for like
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        }
      );

      if (response.ok) {
        setIsLiked(!isLiked); // Toggle isLiked state
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1); // Update like count based on action
      } else {
        toast.error(
          `Error ${likeAction === "like" ? "liking" : "unliking"} the post!`
        );
      }
    } catch (error) {
      console
        .error
        // `Error ${likeAction === "like" ? "liking" : "unliking"} the post:`,
        // error
        ();
    }
  };

  return (
    <>
      <a
        className="link-opacity-75 link-opacity-100-hover link-underline-light"
        onClick={handleToggleLike}
      >
        {isLiked ? "Like" : "Like"}: {likeCount}
      </a>
    </>
  );
};

export default Likes;
