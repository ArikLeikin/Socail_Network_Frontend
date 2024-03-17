import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "../components/post/Post";
import { Card, ListGroup } from "react-bootstrap";
import moment from "moment";
import "./commentView.css";
import EditCommentButtons from "../components/editComment/EditComment";
import { ToastContainer, toast } from "react-toastify";
const baseURL = "http://localhost:3000";
interface Comment {
  _id: string;
  user: string;
  post: string;
  body: string;
  createdAt: Date;
}

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

const CommentsView = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const user = JSON.parse(localStorage.getItem("user")); // This should have a type but I'm leaving it as-is for now
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null); // Initialize with null
  const [ignored, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const navigate = useNavigate();

  const getComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/posts/comments/${commentId}/getComment/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (response.ok) {
        const comment: Comment = await response.json();
        return comment;
      } else {
        console.error("Failed to fetch comment with ID:", commentId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching comment data:", error);
      return null;
    }
  };

  const getComments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (response.ok) {
        const postData: PostData = await response.json();
        setPost(postData); // Update post state

        const commentData = await Promise.all(
          postData.comments.map(getComment)
        );
        setComments(
          commentData.filter((comment) => comment !== null) as Comment[]
        );
      } else {
        console.error("Failed to fetch post data");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const editComment = async (commentId: string) => {
    // Add logic to edit the comment

    console.log("Editing comment with ID:", commentId);
    forceUpdate();
  };

  const deleteComment = async (commentId: string) => {
    // Add logic to delete the comment
    try {
      const response = await fetch(
        `${baseURL}/posts/comments/${commentId}/deleteComment/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Deleted Comment");
        forceUpdate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderComments = () => {
    forceUpdate();
  };

  useEffect(() => {
    getComments();
  }, [postId, ignored]);

  return (
    <div className="d-flex flex-column align-items-center">
      <div>
        {post && <Post post={post} renderHome={renderComments} />}
        {comments
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((comment, index) => (
            <Card className="my-2" key={index} style={{ width: "100%" }}>
              <Card.Body>
                <Card.Text>{comment.body}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  <div className="d-flex flex-row">
                    <div>
                      Posted on{" "}
                      {moment(comment.createdAt).format(
                        "MMM Do YYYY, HH:mm:ss"
                      )}
                    </div>
                    <div>
                      {comment.user === user._id && (
                        <EditCommentButtons
                          onEdit={() => editComment(comment._id)}
                          onDelete={() => deleteComment(comment._id)}
                        />
                      )}{" "}
                      {/* Add conditional rendering */}
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CommentsView;
