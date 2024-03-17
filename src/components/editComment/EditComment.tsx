import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, ListGroup } from "react-bootstrap";
import moment from "moment";

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
