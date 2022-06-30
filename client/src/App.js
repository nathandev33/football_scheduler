// import logo from "./logo.svg";
// import "./App.css";
import React from "react";
import styles from "./App.module.css";
import Dny from "./components/List/Dny";
// import Login from "./components/Login/Login";
import PrivateRoute from "./PrivateRoute";
// import FormButton from "./FormButton";
// import { useNavigate } from "react-router-dom";

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  // useNavigate,
} from "react-router-dom";

function App() {
  const serverURL = "https://hraci.herokuapp.com/login";
  // const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // function handleClick() {
  //   forceUpdate();
  // }
  // const history = useHistory();
  // let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLogged, setIsLogged] = useState(null);
  const [zmena2, setZmena] = useState(false);
  const inputRef = React.useRef(null);

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
      console.log("dostal jsem se zde 1");
      // setIsLogged(true);
      setZmena(true);
      console.log(zmena2);
      // setIsLogged(true);
      // setTimeout(() => {
      //   window.location.assign("/dashboard");
      // }, 2000);
      if (resJson.message === "success!") {
        console.log("dostal jsem se zde 2");
        console.log(zmena2);
        setIsLogged(true);
        // handleClick();

        // navigate("/dashboard");
        // let path = `/dashboard`;
        // navigate(path);¨
        // window.location.href = "/dashboard";
      }

      if (res.status === 200) {
        // setName("");
        setEmail("");
        setMessage("Jsi přihášen! ✅");
        setTimeout(() => {
          inputRef.current.click();
        }, 2000);
      } else {
        setMessage("Chybně zadané údaje.");
        setIsLogged(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const [data, setData] = React.useState(null);
  // // const [isLoggedIn, setIsLoggedIn] = React.useState(null)

  // React.useEffect(() => {
  //   // fetch("https://hraci.herokuapp.com/api")
  //   fetch("http://127.0.0.1:5000/api")
  //     .then((res) => res.json())
  //     // .then((data) => console.log(data))
  //     .then((data) => setData(data));
  // }, []);

  return (
    <Router>
      {/* <div className={`App`}> */}
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      {/* <p>{!data ? "Loading....." : data.message}</p>
        <p>{!data ? "" : data.hrac}</p>
        <p>ahojky</p>
        <p>{!data ? "" : data.dny.monday[0].hrac}</p> */}
      {/* <Dny data={data}></Dny> */}
      {/* </div> */}
      {/* <Link to="/">Home</Link> */}
      {/* <Link to="/about">About</Link> */}
      <div className={styles.buttonsWrapper}>
        <Link className={styles.rozpisLink} to="/rozpis">
          rozpis
        </Link>
        <button
          className={styles.rozpisLink}
          onClick={() => setIsLogged(false)}
        >
          odhlásit se{" "}
        </button>
      </div>
      {/* <Link to="/">Login</Link> */}
      {/* <Link to="/login"> Got to Profile</Link> */}
      <Routes>
        {/* <Route element={ProtectedRoutes}> */}
        {/* <Route path="/about" element={<About />}></Route> */}
        {/* <Route path="/dashboard" element={<Dny data={data} />}></Route> */}
        <Route element={<PrivateRoute zmena2={zmena2} isLogged={isLogged} />}>
          <Route
            path="/rozpis"
            // element={<Dny data={data} username={name} />}
            element={<Dny username={name} />}
          />
        </Route>

        {/* </Route> */}
        {/* <Route path="/" element={<Home />}></Route> */}
        {/* <Route path="/" element={<Login isLogged={isLogged} />}></Route> */}
        {/* nové */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route element={<PrivateRoute isLogged={isLogged} />}>
          <Route path="/dashboard" element={<Dny />} />
        </Route>
      </Routes>
      <div className={styles.App}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            name="username"
            value={name}
            placeholder="hráč"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            value={email}
            placeholder="heslo"
            name="password"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <FormButton></FormButton> */}
          <button type="submit" className={styles.formButton}>
            Přihlásit se
          </button>

          <div className={styles.input}>
            {message ? <p>{message}</p> : null}
          </div>
        </form>
      </div>
    </Router>
  );
}

export default App;
