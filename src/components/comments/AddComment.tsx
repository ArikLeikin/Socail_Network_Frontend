import React, { useState } from "react";

const AddComment = ({ post, onCommentAdded }) => {
  const [comment, setComment] = useState("");

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser._id;

    if (comment.trim() !== "") {
      try {
        const requestData = {
          user: userId,
          post: post._id,
          body: comment,
        };
        const response = await fetch(
          `http://localhost:3000/posts/comments/${post._id}/createComment`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        if (response.ok) {
          setComment("");
          // Call the callback function passed from the parent component
          onCommentAdded(comment);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "95%" }}>
      <div className="d-flex justify-content-center form-group my-1">
        <input
          type="text"
          className="form-control mx-1"
          value={comment}
          onChange={handleChange}
          placeholder="Add your comment..."
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </div>
    </form>
  );
};

export default AddComment;
