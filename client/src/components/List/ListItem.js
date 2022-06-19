import React from "react";
import styles from "./ListItem.module.css";

function ListItem(props) {
  return (
    <li className={styles.ListItem}>
      {props.hrac} {props.note}
    </li>
  );
}

export default ListItem;
