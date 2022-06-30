// import logo from "./logo.svg";
// import "./App.css";
import React from "react";
import styles from "./App.module.css";
import Dny from "./components/List/Dny";
// import Login from "./components/Login/Login";
import PrivateRoute from "./PrivateRoute";
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
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
  // const history = useHistory();
  // let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("http://127.0.0.1:5000/login", {
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
      // setIsLogged(true);
      setIsLogged(true);
      if (resJson.message === "success!") {
        handleClick();
        setIsLogged(true);

        // navigate("/dashboard");
        // let path = `/dashboard`;
        // navigate(path);¨
        // window.location.href = "/dashboard";
        // setTimeout(() => {
        //   window.location.assign("/dashboard");
        // }, 2000);
      }

      if (res.status === 200) {
        // setName("");
        setEmail("");
        setMessage("User created successfully");
        // setTimeout(() => {
        //   window.location.assign("/dashboard");
        // }, 2000);
      } else {
        setMessage("Some error occured");
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
      <div className={`App`}>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>{!data ? "Loading....." : data.message}</p>
        <p>{!data ? "" : data.hrac}</p>
        <p>ahojky</p>
        <p>{!data ? "" : data.dny.monday[0].hrac}</p> */}
        {/* <Dny data={data}></Dny> */}
      </div>
      {/* <Link to="/">Home</Link> */}
      {/* <Link to="/about">About</Link> */}
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/">Login</Link>
      {/* <Link to="/login"> Got to Profile</Link> */}
      <button onClick={() => setIsLogged(false)}>Odhlásit se </button>
      <Routes>
        {/* <Route element={ProtectedRoutes}> */}
        {/* <Route path="/about" element={<About />}></Route> */}
        {/* <Route path="/dashboard" element={<Dny data={data} />}></Route> */}
        <Route element={<PrivateRoute isLogged={isLogged} />}>
          <Route
            path="/dashboard"
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
            type="text"
            value={email}
            placeholder="heslo"
            name="password"
            onChange={(e) => setEmail(e.target.value)}
          />

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
