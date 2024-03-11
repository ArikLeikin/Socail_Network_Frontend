import React, { useState, useEffect, useReducer } from "react";
import { Alert } from "react-bootstrap";
import "./login.css";
import BackgroundImage from "../assets/background.png";
import Post from "../components/post/Post";
import AddPost from "../components/addPost/AddPost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const getFormattedDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric", // or "2-digit"
    minute: "numeric", // or "2-digit"
    hour12: false,
  };
  const formattedDate = date.toLocaleDateString(undefined, options);
  return formattedDate;
};

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const user = JSON.parse(localStorage.getItem("user"));
  const [isAddedNewPost, setAddedNewPost] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const handleAddPost = async (newPost: PostData) => {
    try {
      // await fetchUserForPost(newPost.id, newPost.user);
      newPost.likes = [];
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      forceUpdate();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts/allPosts", {
          method: "GET",
        });

        if (response.ok) {
          console.log("Successful");
          const data: PostData[] = await response.json();
          setPosts(data.reverse());

          // data.forEach((post) => {
          //   fetchUserForPost(post.id, post.user);
          // });
        } else {
          toast.error("Error fetching posts!");
        }
      } catch (error) {}
    };

    fetchPosts();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center">
      <AddPost onAddPost={handleAddPost} key={"tt"} />
      {posts.map((post, index) => (
        <Post post={post} key={post._id} />
      ))}
    </div>
  );
};

export default Home;
