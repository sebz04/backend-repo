import React from "react";
import "./Button.css"; // your 3D button styles

const MyButton = ({ label, onClickHandler, isChanged }) => {
  if (isChanged) {
    return (
      <button className="button-3d" onClick={onClickHandler}>
        {label}
      </button>
    );
  } else {
    return (
      <button className="button-3d" disabled>
        {label}
      </button>
    );
  }
};

export default MyButton;
