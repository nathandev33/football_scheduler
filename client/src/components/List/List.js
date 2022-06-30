import React from "react";
import styles from "./List.module.css";
import ListItem from "./ListItem";
import Button from "./Button";

export default function List(props) {
  const zapsatSe = async () => {
    try {
      let res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: props.username,
          day: props.den,
          note: "budu jen 30 minut",
          action: "zapsat-se",
        }),
      });
      //  let x = 2;
      let zmenaStavuCislo = new Date().getTime();
      let resJson = await res.json();
      console.log(resJson);
      console.log("úspěšně zapsán");
      props.setZmenaStavu(zmenaStavuCislo);

      // props.rerenderComponent();
      // if (resJson.message === "success!") {
      //   // setLoggedIn(true);
      //   let path = `/dashboard`;
      //   navigate(path);
      // }

      if (res.status === 200) {
        // setName("");
        // setEmail("");
        // setMessage("User created successfully");
        console.log("zapsaán");
      } else {
        // setMessage("Some error occured");
        console.log("failed");
        // setLoggedIn(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const odhlasitSe = async () => {
    try {
      let res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: props.username,
          day: props.den,
          action: "zrusit",
        }),
      });

      let resJson = await res.json();
      console.log(resJson);
      console.log("úspěšně odhlášen");
      let zmenaStavuCislo = new Date().getTime();
      props.setZmenaStavu(zmenaStavuCislo);

      // if (resJson.message === "success!") {
      //   // setLoggedIn(true);
      //   let path = `/dashboard`;
      //   navigate(path);
      // }

      if (res.status === 200) {
        // setName("");
        // setEmail("");
        // setMessage("User created successfully");
        console.log("odhlášen");
      } else {
        // setMessage("Some error occured");
        console.log("failed");
        // setLoggedIn(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
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
    <div className={styles.container}>
      <div className={styles.denVTydnu}>
        {dny[props.cislo_dne]} {props.datum} v 15:00 - Účko
      </div>
      {/* <h2>{!props.data ? "" : props.data.dny.monday[0].hrac}</h2> */}

      {!props.data ? (
        <p></p>
      ) : (
        <ul className={styles.ul}>
          {props.data.map((item) => {
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

      <div className={styles.buttonContainer}>
        <Button
          username={props.username}
          onClick={zapsatSe}
          text="zapsat se"
        ></Button>
        <Button
          username={props.username}
          onClick={odhlasitSe}
          text="zrušit"
        ></Button>
      </div>
    </div>
  );
}
