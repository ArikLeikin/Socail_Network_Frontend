import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";

import moment from "moment";
const UserComments = () => {
  const id = JSON.parse(localStorage.getItem("user"))._id;
  const [comments, setComments] = useState([]);
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
      console.log("response", response);

      if (response.ok) {
        const commentsData = await response.json();
        console.log("commentsData", commentsData);
        setComments(commentsData);
      }
    };

    fetchComments();
  }, [id]);

  if (!comments) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="card-highlight">
      <h1 id="user-comment-highlight">User Comments</h1>
      </div>
    <div className="comment-card-container">
      {comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((comment, index) => (
        <Card key={index} style={{ width: "25rem", marginBottom: "1rem" }}>
          <Card.Body>
            <Card.Text>{comment.body}</Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Posted on {moment(comment.createdAt).format('MMM Do YYYY, HH:mm:ss')}</ListGroup.Item>
          </ListGroup>
        </Card>   
      ))}
      </div>
    
   
  
   


    </>
  );
}

export default UserComments;