import React, { useEffect, useReducer, useState } from "react";
import Post from "../components/post/Post";
// import { Card } from 'react-bootstrap';
// import ListGroup from 'react-bootstrap/ListGroup';

interface PostData {
  _id: number;
  title: string;
  user: string;
  body: string;
  picture: string;
  createdAt: Date;
  likes: string[];
  comments: string[];
}

const UserPosts = () => {
  const id = JSON.parse(localStorage.getItem("user"))._id;
  const [posts, setPosts] = useState([]);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  console.log("id", id);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `http://localhost:3000/userActivity/${id}/posts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);

      if (response.ok) {
        const postsData = await response.json();
        console.log("postsData", postsData);
        setPosts(postsData);
      }
    };

    fetchPosts();
  }, [id, ignored]);
  if (!posts) {
    return <div>Loading...</div>;
  }

  const renderHome = () => {
    console.log("Render Home");
    forceUpdate();
  };

  return (
    <>
      <div className="card-highlight">
        <h1>User Posts</h1>
      </div>
      {posts
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((post: PostData) => (
          <div className="UserPosts">
            <Post key={post._id} post={post} renderHome={renderHome} />
          </div>

        ))}
    </>
  );
};

export default UserPosts;
