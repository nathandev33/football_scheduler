import React from "react";
import styles from "./Button.module.css";
function Button(props) {
  return (
    <div className={styles.Button}>
      <button onClick={props.onClick}>{props.text}</button>
    </div>
  );
}

export default Button;
