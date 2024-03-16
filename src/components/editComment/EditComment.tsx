import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, ListGroup } from "react-bootstrap";
import moment from "moment";

const EditCommentButtons = () => {
  return (
    <div>
      <button className="btn btn-light mx-2 px-1 py-1">Edit</button>
      <button className="btn btn-light px-1 py-1">Delete</button>
    </div>
  );
};

export default EditCommentButtons;
