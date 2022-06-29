import React from "react";
import styles from "./ListItem.module.css";

function ListItem(props) {
  const barvy = [
    "red",
    "green",
    "yellow",
    "blue",
    "pink",
    "orange",
    "a",
    "b",
    "c",
    "d",
  ];
  const random_barva = barvy[Math.floor(Math.random() * barvy.length)];
  return (
    <li className={`${styles.ListItem} ${styles[random_barva]}`}>
      {props.hrac}
      {/* {props.note} */}
    </li>
  );
}

export default ListItem;
