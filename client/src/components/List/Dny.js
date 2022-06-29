import React from "react";
import styles from "./Dny.module.css";
import List from "./List";

function Dny(props) {
  // const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [data, setData] = React.useState(null);
  // const [isLoggedIn, setIsLoggedIn] = React.useState(null)

  React.useEffect(() => {
    // fetch("https://hraci.herokuapp.com/api")
    fetch("http://127.0.0.1:5000/api")
      .then((res) => res.json())
      // .then((data) => console.log(data))
      .then((data) => setData(data));
  }, [data]);
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
        <p>V tomto roce neexistuje žádná položka.</p>
      ) : (
        dny.map((el, i) => {
          return (
            <List
              username={props.username}
              data={data.dny[el]}
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
