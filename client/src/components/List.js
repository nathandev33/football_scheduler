import React from "react";
import styles from "./List.module.css";
import ListItem from "./ListItem";

export default function List(props) {
  return (
    <div className={styles.List}>
      <h1>{props.den}</h1>
      {/* <h2>{!props.data ? "" : props.data.dny.monday[0].hrac}</h2> */}

      {!props.data ? (
        <p></p>
      ) : (
        <ul>
          {props.data.dny.monday.map((item) => {
            return (
              <ListItem
                key={item._id}
                hrac={item.hrac}
                note={item.note}
              ></ListItem>
            );
          })}
        </ul>
      )}
    </div>
  );
}
