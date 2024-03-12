import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PostComments = () => {
  const { postId } = useParams(); // Retrieve postId from URL parameters
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/posts/${postId}/comments`
        );
        if (response.ok) {
          const commentsData = await response.json();
          setComments(commentsData);
        } else {
          console.error("Error fetching comments:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div>
      <h2>Comments for Post {postId}</h2>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostComments;
