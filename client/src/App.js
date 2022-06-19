// import logo from "./logo.svg";
// import "./App.css";
import React from "react";
import styles from "./App.module.css";
import Dny from "./components/Dny";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    // fetch("https://hraci.herokuapp.com/api")
    fetch("http://127.0.0.1:5000/api")
      .then((res) => res.json())
      // .then((data) => console.log(data))
      .then((data) => setData(data));
  }, []);

  return (
    <div className={`App ${styles.App}`}>
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <p>{!data ? "Loading....." : data.message}</p>
      <p>{!data ? "" : data.hrac}</p>
      <p>ahojky</p>
      <p>{!data ? "" : data.dny.monday[0].hrac}</p>
      <Dny data={data}></Dny>
    </div>
  );
}

export default App;
