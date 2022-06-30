import React, { useState } from "react";
import styles from "./Dny.module.css";
import List from "./List";

function Dny(props) {
  // const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [data, setData] = React.useState(null);
  // const [isLoggedIn, setIsLoggedIn] = React.useState(null)
  const [zmenaStavu, setZmenaStavu] = useState("něco");
  const serverURL = "https://hraci.herokuapp.com/api";
  console.log(zmenaStavu);
  React.useEffect(() => {
    // fetch("https://hraci.herokuapp.com/api")
    fetch(serverURL)
      .then((res) => res.json())
      // .then((data) => console.log(data))
      .then((data) => setData(data));
  }, [zmenaStavu]);
  const dny = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // function handleClick() {
  //   forceUpdate();
  // }
  return (
    <div className={styles.Dny}>
      {!data ? (
        <p>Někde se stala chyba, zkuste proím znovu načíst stránku</p>
      ) : (
        dny.map((el, i) => {
          return (
            <List
              className={styles.days_container}
              username={props.username}
              data={data.dny[el]}
              setZmenaStavu={setZmenaStavu}
              den={el}
              cislo_dne={i}
              datum={new Date(
                new Date("2022-06-27").getTime() + i * (3600 * 1000 * 24)
              ).toLocaleString("cs-CZ", { month: "2-digit", day: "2-digit" })}
              // rerenderComponent={handleClick}
            ></List>
          );
        })
      )}
    </div>
  );
}

export default Dny;
