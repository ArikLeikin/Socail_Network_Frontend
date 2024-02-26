import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "./login.css";
import BackgroundImage from "../assets/background.png";
import Post from "../components/post/Post";
import AddPost from "../components/addPost/AddPost"; // Import the new component

interface PostData {
  id: number;
  title: string;
  body: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([
    { id: 1, title: "Post 1", body: "This is the content of Post 1." },
    { id: 2, title: "Post 2", body: "This is the content of Post 2." },
    { id: 3, title: "Post 3", body: "This is the content of Post 3." },
    // Add more posts as needed
  ]);

  const [show, setShow] = useState(false);

  const handleAddPost = (newPost: PostData) => {
    setPosts([...posts, newPost]);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <AddPost onAddPost={handleAddPost} /> {/* Add the new post component */}
      {show && (
        <Alert variant="danger">
          Error fetching posts. Please try again later.
        </Alert>
      )}
      {posts.map((post) => (
        <div className="myWrapper mt-5" key={post.id}>
          <div className="center"></div>
          <div className="post-wrapper">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
