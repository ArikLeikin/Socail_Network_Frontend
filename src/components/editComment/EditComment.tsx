import React from "react";

const EditCommentButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <button className="btn btn-light mx-2 px-1 py-1" onClick={onEdit}>
        Edit
      </button>
      <button className="btn btn-light px-1 py-1" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default EditCommentButtons;
