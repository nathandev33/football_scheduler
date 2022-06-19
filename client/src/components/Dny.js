import React from "react";
import styles from "./Dny.module.css";
import List from "./List";

function Dny(props) {
  const dny = [
    "Pondělí",
    "Úterý",
    "Středa",
    "Čtvrtek",
    "Pátek",
    "Sobota",
    "Neděle",
  ];
  return (
    <div className={styles.Dny}>
      <h1>DNY</h1>
      {dny.map((el) => {
        return <List data={props.data} den={el}></List>;
      })}
    </div>
  );
}

export default Dny;
