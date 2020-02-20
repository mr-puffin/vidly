import React from "react";

// Input: (boolean) liked
// Output: onClick

const Like = ({ liked, onLike }) => {
  let classes = "fa fa-heart";
  classes += liked ? "" : "-o";
  return (
    <i
      className={classes}
      aria-hidden="true"
      style={{ cursor: "pointer" }}
      onClick={onLike}
    ></i>
  );
};

export default Like;
