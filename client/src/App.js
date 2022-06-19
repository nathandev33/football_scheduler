// import logo from "./logo.svg";
// import "./App.css";
import React from "react";

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
    <div className="App">
      <div className="pokus">ahoj</div>
      <header className="App-header AHOJ">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>{!data ? "Loading....." : data.message}</p>
        <p>{!data ? "" : data.hrac}</p>
        <p>ahojky</p>
        <p>{!data ? "" : data.dny.monday[0].hrac}</p> }
        {/* <div className="expenses-container">
          {data.dny.monday.map(
            (
              element // POZOR! tady není curly braces {}
            ) => (
              <div
                key={element.id} // key je kvůli lepšímu performance a předejdu tak bugs.
                title={element.title}
                amount={element.amount}
                date={element.date}
              />
              
            )
          )}
        </div> */}
      </header>
    </div>
  );
}

export default App;
