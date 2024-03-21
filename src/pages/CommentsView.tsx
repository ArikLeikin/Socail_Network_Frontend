import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "../components/post/Post";
import { Card, ListGroup } from "react-bootstrap";
import moment from "moment";
import EditCommentButtons from "../components/editComment/EditComment";
import { ToastContainer, toast } from "react-toastify";
import "./commentView.css";
import SERVER_URL from "../config"

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
  const [editableCommentId, setEditableCommentId] = useState<string | null>(
    null
  ); // Track which comment is currently being edited
  const [editedComment, setEditedComment] = useState<string>(""); // Track edited comment text
  const user = JSON.parse(localStorage.getItem("user"));
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [ignored, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const navigate = useNavigate();

  const getComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `${SERVER_URL}/posts/comments/${commentId}/getComment/${postId}`,
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
      const response = await fetch(`${SERVER_URL}/posts/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (response.ok) {
        const postData: PostData = await response.json();
        setPost(postData);

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
    try {
      const response = await fetch(
        `${SERVER_URL}/posts/comments/${commentId}/updateComment/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({ body: editedComment }), // Send the edited comment text in the request body
        }
      );
      if (response.ok) {
        toast.success("Comment edited successfully");
        setEditableCommentId(null); // Reset editable comment ID
        setEditedComment(""); // Clear edited comment text
        forceUpdate();
      } else {
        toast.error("Failed to edit comment");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Failed to edit comment");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `${SERVER_URL}/posts/comments/${commentId}/deleteComment/${postId}`,
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
                {editableCommentId === comment._id ? (
                  <input
                    type="text"
                    className="form-control mx-1"
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                ) : (
                  <Card.Text>{comment.body}</Card.Text>
                )}
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
                      {comment.user === user._id ? (
                        editableCommentId === comment._id ? (
                          <>
                            <button
                              onClick={() => editComment(comment._id)}
                              className="btn btn-primary mx-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditableCommentId(null)}
                              className="btn btn-secondary"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <EditCommentButtons
                            onEdit={() => {
                              setEditedComment(comment.body); // Set initial value of editedComment
                              setEditableCommentId(comment._id);
                            }}
                            onDelete={() => deleteComment(comment._id)}
                          />
                        )
                      ) : null}
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
