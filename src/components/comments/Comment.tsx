import React, { useEffect, useState } from "react";

const Comment = ({ post }) => {
  const [commentsCount, setCommentsCount] = useState(post.comments.length);

  return (
    <>
      <a className="link-opacity-75 link-opacity-100-hover link-underline-light">
        Comments: {commentsCount}
      </a>
    </>
  );
};

export default Comment;
