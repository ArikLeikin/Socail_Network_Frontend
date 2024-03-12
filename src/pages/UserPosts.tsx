import React, { useEffect, useState } from 'react';
import  Post  from '../components/post/Post';
// import { Card } from 'react-bootstrap';
// import ListGroup from 'react-bootstrap/ListGroup';

const UserPosts = ()=> {
  const  id  = JSON.parse(localStorage.getItem("user"))._id;
  const [posts, setPosts] = useState([]);
    console.log("id", id);
    
    useEffect(() => {
      const fetchPosts = async () => {
        const response = await fetch(`http://localhost:3000/userActivity/${id}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("response", response);
        
        if (response.ok) {
          const postsData = await response.json();
          console.log("postsData", postsData);
          setPosts(postsData);
        }
      };
  
      fetchPosts();
    }, [id]);
    if (!posts) {
      return <div>Loading...</div>;
    }



  return (
<div>
  <h1>User Posts</h1>
  {posts.map((post: React.JSX.Element, index: number) => (
    <Post key={index} post={post} />

    // <Card key={index} style={{ width: '18rem', marginBottom: '1rem' }}>
    //   <Card.Img variant="top" src={`http://localhost:3000/public/${post.picture}`} />
    //   <Card.Body>
    //     <Card.Title>{post.title}</Card.Title>
    //     <Card.Text>{post.body}</Card.Text>
    //   </Card.Body>
    //   <ListGroup className="list-group-flush">
    //     <ListGroup.Item>{post.likes} Likes</ListGroup.Item>
    //     <ListGroup.Item>Posted on {post.createdAt.toLocaleString()}</ListGroup.Item>
    //   </ListGroup>
    //   <Card.Body>
    //     <Card.Link href="#">View Post</Card.Link>
    //     <Card.Link href="#">Edit Post</Card.Link>
    //   </Card.Body>
    // </Card>
  ))}
</div>
  );
};

export default UserPosts;
