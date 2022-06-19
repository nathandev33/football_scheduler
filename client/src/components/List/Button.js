import React from "react";
import styles from "./Button.module.css";
function Button(props) {
  return (
    <div className={styles.Button}>
      <button>{props.text}</button>
    </div>
  );
}

export default Button;
