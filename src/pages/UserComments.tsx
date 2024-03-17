import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";

import moment from "moment";
import { PostData } from "../components/post/Post";
import { useNavigate } from "react-router-dom";
const UserComments = () => {
  const id = JSON.parse(localStorage.getItem("user"))._id;
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState<PostData>();
  const navigate = useNavigate();
  console.log("id", id);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(
        `http://localhost:3000/userActivity/${id}/comments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("response", response);

      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      }
    };

    fetchComments();
  }, [id, selectedPost]);

  if (!comments) {
    return <div>Loading...</div>;
  }

  async function handleCommentClick(postId: PostData): Promise<void> {
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("response", response);
      const postData = await response.json();
      console.log("postData", postData);
      setSelectedPost(postData);
      navigate(`/comments/${postId}`);
    }
  }

  return (
    <>
      <div className="card-highlight">
        <h1 id="user-comment-highlight">User Comments</h1>
      </div>
      <div className="comment-card-container">
        {comments
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((comment, index) => (
            <a>
              <Card
                key={index}
                style={{ width: "25rem", marginBottom: "1rem" }}
                onClick={() => handleCommentClick(comment.post)}
              >
                <div></div>

                <Card.Body>
                  <Card.Text>{comment.body}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>
                    Posted on{" "}
                    {moment(comment.createdAt).format("MMM Do YYYY, HH:mm:ss")}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </a>
          ))}
      </div>
    </>
  );
};

export default UserComments;
