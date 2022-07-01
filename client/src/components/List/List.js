import React from "react";
import styles from "./List.module.css";
import ListItem from "./ListItem";
import Button from "./Button";

export default function List(props) {
  async function zapsatNeboZrusit(action) {
    try {
      let res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: props.username,
          day: props.den,
          note: props.note,
          action: action,
        }),
      });

      if (res.status === 200) {
        let zmenaStavuCislo = new Date().getTime();
        props.setZmenaStavu(zmenaStavuCislo);
        console.log("Úspěšně zapsán");
      } else {
        console.log("Zapsání se nepodařilo, zkuste to prosím znovu.");
      }
    } catch (err) {
      console.log(err);
    }
  }
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
          onClick={() => zapsatNeboZrusit("zapsat-se")}
          text="zapsat se"
        ></Button>
        <Button
          username={props.username}
          onClick={() => zapsatNeboZrusit("zrusit")}
          text="zrušit"
        ></Button>
      </div>
    </div>
  );
}
