// // const getBtn = document.getElementById("zrusit");
// // import axios from "axios";

// const postBtn = document.getElementById("zapsat-se");
// const attr = postBtn.getAttribute("id");

// const login = () => {
//   fetch("/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       user: {
//         name: "John",
//         email: "john@example.com",
//       },
//     }),
//   });
// };

// // getBtn.addEventListener("click", getData);
// postBtn.addEventListener("click", login);

// const getBtn = document.getElementById("get-btn");
const postBtn = document.getElementById("zapsat-se");
const buttons = document.querySelectorAll(".buttons");

// FETCH má menší browser support (starší browsery don't support.)
// narozdíl od XMLHttpRequest používá promises out of the box, nemusíme promisify nic ručně.
// handler error je trochu clunky

const sendHttpRequest = (method, url, data) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data), // toto se týká jen POST requestu, u GET žádná data neposílám
    headers: data ? { "Content-Type": "application/json" } : {},
  }).then((response) => {
    if (response.status >= 400) {
      // !response.ok
      return response.json().then((errResData) => {
        const error = new Error("Something went wrong!");
        error.data = errResData;
        throw error;
      });
    }
    return response.json(); // jako response bez tohoto dostanu "readableStream". abych ale response mohl číst jako javascript object, musím překonvertovat
  });
};

// const getData = () => {
//   sendHttpRequest("GET", "https://reqres.in/api/users").then((responseData) => {
//     console.log(responseData);
//   });
// };
let action;

const sendData = () => {
  sendHttpRequest("POST", "http://127.0.0.1:5000/", {
    email: "eve.holt@reqres.in",
    username: "ronaldo",
    password: "heslo",
    day: "monday",
    note: "blal kba",
    action,
    // password: "pistol",
  })
    .then((responseData) => {
      console.log(responseData);
    })
    .catch((err) => {
      console.log(err, err.data);
    });
};

// getBtn.addEventListener("click", getData);
Array.from(buttons).forEach((btn) => {
  btn.addEventListener("click", () => {
    const attr = btn.getAttribute("id");
    console.log(attr);
    if (attr == "zapsat-se") action = "zapsat-se";
    if (attr == "zrusit") action = "zrusit";
    sendData();
  });
});
