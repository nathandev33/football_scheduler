import React from "react";
import styles from "./List.module.css";
import ListItem from "./ListItem";
import Button from "./Button";

export default function List(props) {
  const zapsatSe = async () => {
    try {
      let res = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: props.username,
          day: props.el,
          note: "budu jen 30 minut",
          action: "zapsat-se",
        }),
      });

      let resJson = await res.json();
      console.log(resJson);
      console.log("úspěšně zapsán");
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

  return (
    <div className={styles.List}>
      <h1>{props.den}</h1>
      {/* <h2>{!props.data ? "" : props.data.dny.monday[0].hrac}</h2> */}

      {!props.data ? (
        <p></p>
      ) : (
        <ul>
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

      <Button
        username={props.username}
        onClick={zapsatSe}
        text="zapsatttttt se"
      ></Button>
      <Button username={props.username} text="odhláaaaasit se"></Button>
    </div>
  );
}
