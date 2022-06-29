import React from "react";

import classes from "./Button.module.css";

const Button = (props) => {
  // const hrac = props.username;
  const sayHello = () => {
    console.log("kliknl");
    alert("hello!");
  };
  return (
    <button
      type={props.type || "button"}
      className={`${classes.button} ${props.className}`}
      disabled={props.disabled}
      onClick={() => alert("hello")}
    >
      {props.children}
    </button>
  );
};

export default Button;
