import React, { useState, useEffect } from "react";

const Comment = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState([]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch individual comments for the post
        const comments = [];
        for (const commentId of post.comments) {
          const response = await fetch(
            `http://localhost:3000/posts/comments/${commentId}/getComment/${post._id}`
          );
          if (response.ok) {
            const commentData = await response.json();
            comments.push(commentData);
          } else {
            console.error("Error fetching comment:", response.statusText);
          }
        }
        setCommentsData(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (showComments) {
      fetchComments();
    }
  }, [post.comments, showComments]);

  return (
    <>
      <a
        className="link-opacity-75 link-opacity-100-hover link-underline-light"
        onClick={toggleComments}
        style={{ cursor: "pointer" }}
      >
        Comments: {post.comments.length}
      </a>
      {showComments && (
        <div className="comment-overlay">
          <div className="comment-window">
            {/* Render comments list here */}
            {commentsData.map((comment, index) => (
              <div key={index} className="comment">
                {comment.body}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
