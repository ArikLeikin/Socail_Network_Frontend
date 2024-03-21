import React, { useState, useEffect, useReducer } from "react";
import "./login.css";
import Post from "../components/post/Post";
import AddPost from "../components/addPost/AddPost";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SERVER_URL from "../config"

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

interface UserData {
  email: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const user = JSON.parse(localStorage.getItem("user"));
  const [isAddedNewPost, setAddedNewPost] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleAddPost = async (newPost: PostData) => {
    try {
      newPost.likes = [];
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      forceUpdate();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleRender = () => {
    forceUpdate();
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/posts/allPosts`, {
          method: "GET",
        });

        if (response.ok) {
          console.log("Successful");
          const data: PostData[] = await response.json();
          setPosts(data.reverse());

        } else {
          toast.error("Error fetching posts!");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [ignored]);

  return (
    <div className="d-flex flex-column align-items-center">
      <div
        className="d-flex flex-column align-items-center"
        style={{ width: "35%" }}
      >
        <AddPost onAddPost={handleAddPost} key={"tt"} />
        {posts.map((post, index) => (
          <Post renderHome={handleRender} post={post} key={post._id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
