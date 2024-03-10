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
  user: string;
  body: string;
  picture: string;
  createdAt: Date;
}

interface UserData {
  email: string;
}

const getFormattedDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const options = { hour: "numeric", minute: "numeric", hour12: false };
  const formattedDate = date.toLocaleDateString(undefined, options);
  return formattedDate;
};

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [showError, setShowError] = useState(false);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const user = JSON.parse(localStorage.getItem("user"));
  const handleAddPost = async (newPost: PostData) => {
    try {
      await fetchUserForPost(newPost.id, newPost.user);
      setPosts([...posts, newPost]);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };
  const fetchUserForPost = async (postId: number, userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      if (response.ok) {
        const userData: UserData = await response.json();
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData }));
      } else {
        toast.error("Error fetching user data!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
          setPosts(data);

          data.forEach((post) => {
            fetchUserForPost(post.id, post.user);
          });
        } else {
          toast.error("Error fetching posts!");
        }
      } catch (error) {
        setShowError(true);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center">
      <AddPost onAddPost={handleAddPost} />
      {posts
        .slice()
        .reverse()
        .map((post) => (
          <div
            className="myWrapper mt-5"
            key={post.id}
            style={{ overflowWrap: "break-word" }}
          >
            <div className="center"></div>
            <div className="post-wrapper d-flex flex-column align-items-center">
              <div className="d-flex flex-column align-items-center mt-2">
                <h6>{users[post.user]?.email}</h6>
                <h6>{getFormattedDateTime(post.createdAt)}</h6>
              </div>
              <hr />
              <p className="mt-2">{post.body}</p>
              {post.picture && (
                <img
                  src={"http://localhost:3000/public/" + post.picture}
                  alt=""
                  style={{ maxWidth: "100%", height: "600px" }}
                />
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Home;
