import React from "react";
import styles from "./Dny.module.css";
import List from "./List";

function Dny(props) {
  //   const dny = [
  //     "Pondělí",
  //     "Úterý",
  //     "Středa",
  //     "Čtvrtek",
  //     "Pátek",
  //     "Sobota",
  //     "Neděle",
  //   ];
  const dny = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return (
    <div className={styles.Dny}>
      <h1>DNY</h1>

      {!props.data ? (
        <p>V tomto roce neexistuje žádná položka.</p>
      ) : (
        dny.map((el) => {
          return <List data={props.data.dny[el]} den={el}></List>;
        })
      )}
    </div>
  );
}

export default Dny;
