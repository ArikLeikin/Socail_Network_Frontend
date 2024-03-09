import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import "./login.css";
import BackgroundImage from "../assets/background.png";
import Post from "../components/post/Post";
import AddPost from "../components/addPost/AddPost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PostData {
  id: number;
  title: string;
  body: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [showError, setShowError] = useState(false);

  const handleAddPost = (newPost: PostData) => {
    setPosts([...posts, newPost]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts/allPosts", {
          method: "GET",
        });

        if (response.ok) {
          console.log(response.body);

          console.log("Succesful");
        } else {
          toast.error("Error fetching posts!");
        }

        const data: PostData[] = await response.json();
        setPosts(data);
      } catch (error) {
        setShowError(true);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div className="d-flex flex-column align-items-center">
      <AddPost onAddPost={handleAddPost} />
      {posts.map((post) => (
        <div className="myWrapper mt-5" key={post.id}>
          <div className="center"></div>
          <div className="post-wrapper">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default Home;
