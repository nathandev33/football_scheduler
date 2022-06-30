import { useState } from "react";
import styles from "./Login.module.css";

import {
  //   BrowserRouter as Router,
  //   Routes,
  //   Route,
  //   Link,
  useNavigate,
} from "react-router-dom";

function Login({ setIsLogged }) {
  const serverURL = "https://hraci.herokuapp.com/login";
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(serverURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          password: email,
        }),
      });

      let resJson = await res.json();
      console.log(resJson);
      console.log("úspěšně přihlášen");
      setIsLogged(true);
      if (resJson.message === "success!") {
        // setLoggedIn(true);
        let path = `/dashboard`;
        navigate(path);
      }

      if (res.status === 200) {
        setName("");
        setEmail("");
        setMessage("User created successfully");
      } else {
        setMessage("Some error occured");
        // setLoggedIn(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.Login}>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          name="username"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          value={email}
          placeholder="Email"
          name="password"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={styles.button} type="submit">
          Create
        </button>

        <div className={styles.input}>{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

export default Login;
