// const cookieParser = require("cookie-parser");
// const compression = require("compression");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
// const rateLimit = require("express-rate-limit");
// DECLARATIONS
const { check, validationResult } = require("express-validator");

const express = require("express");
const router = express.Router();
const app = express();
app.set("view engine", "ejs");
app.set("views", "front/views");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const { resolve } = require("path");
const path = require("path");

// Copy the .env.example in the root into a .env file in this folder
const env = require("dotenv").config({ path: "./.env" });
const cors = require("cors");

const port = process.env.PORT || 5000;
const User = require("./models/user");
const Day = require("./models/day");
app.use(express.urlencoded({ extended: false }));
// try {
//   app.use(express.static(process.env.STATIC_DIR));
// } catch (e) {
//   console.log("Missing env file, be sure to copy .env.example to .env");
// }
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(express.json());
// app.use(express.bodyParser());
app.use(cors());

// DB CONNECTION
const DB = process.env.DB_CONNECTION_STRING_APP.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

(async () => {
  try {
    await mongoose.connect(DB, {});
    console.log("db connection successfull");
  } catch (err) {
    console.log("error connecting to db: ", err);
  }
})();

const dayID = "62ae4a7c1ce29d4419b9bb71";
// app.get("/", (req, res) => {
//   // const path = resolve(process.env.STATIC_DIR + "/index.ejs");
//   // res.sendFile(path);

// });

// All other GET requests not handled before will return our React app
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

const testovaci = "ahojky";

let MONDAY = [];
let TUESDAY = [];

app.get("/api", async (req, res) => {
  let dny = await Day.findById({
    _id: dayID,
  });
  res.json({
    message: "Hello from server!",
    dny,
    monday: dny.monday,
    hrac: dny.monday[0].hrac,
  });
});

app.post("/create-days", async (req, res) => {
  const days = new Day({});
  await days.save();
  res.send("success");
});

app.post("/", async (req, res) => {
  const { username, password } = req.body;
  const note = req.body.note || "";
  // console.log("tad ", req.body.user.name);

  // 1) Check if email and password inputs not blank
  if (!username || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Zadejte jméno a heslo.",
    });
  }

  // 2) Check if user exists && password is correct
  const userWithCurrentEmail = await User.findOne({
    username: username,
  });
  if (!userWithCurrentEmail) {
    return res.status(400).json({
      status: "fail",
      message: "Uživatel s tímto username nebyl nalezen.",
    });
  }

  if (userWithCurrentEmail.password !== password) {
    return res.status(400).json({
      status: "fail",
      message: "heslo neodpovídá.",
    });
  }

  if (req.body.action == "zapsat-se") {
    console.log("je to zapsat se");

    doc = await Day.findById({
      _id: dayID,
    });
    doc2 = doc.monday;
    doc3 = doc.tuesday;
    console.log(doc2);
    switch (req.body.day) {
      case "monday":
        doc2.push({ hrac: username, note: note });
        break;
      case "tuesday":
        doc3.push({ hrac: username, note: note });
        break;
    }

    await Day.updateOne({ _id: dayID }, { $set: { monday: doc2 } });

    await Day.updateOne({ _id: dayID }, { $set: { tuesday: doc3 } });

    res.json({
      message: "Jsi úspěšně přihlášen!",
      data: req.body,
      doc2: doc2,
      doc3: doc3,
      vsechno: {
        doc2,
        doc3,
      },
      // dny: saved,
    });
  }

  if (req.body.action == "zrusit") {
    console.log("je to zrušit");
    doc = await Day.findById({
      _id: dayID,
    });
    doc2 = doc.monday;
    console.log(doc2);
    doc2 = doc2.filter((el) => {
      return el !== username;
    });
    console.log(doc2);
    // switch (req.body.day) {
    //   case "monday":
    //     doc2.push(username);
    //     break;
    //   case "tuesday":
    //     TUESDAY.push(username);
    //     break;
    // }

    await Day.updateOne({ _id: dayID }, { $set: { monday: doc2 } });

    res.json({
      message: "Zrušen termín.",
    });
  }
});

// app.post("/zrusit", async (req, res) => {
//   const { username, password } = req.body;

//   // 1) Check if email and password inputs not blank
//   if (!username || !password) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Zadejte jméno a heslo.",
//     });
//   }

//   // 2) Check if user exists && password is correct
//   const userWithCurrentEmail = await User.findOne({
//     username: username,
//   });
//   if (!userWithCurrentEmail) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Uživatel s tímto username nebyl nalezen.",
//     });
//   }

//   if (userWithCurrentEmail.password !== password) {
//     return res.status(400).json({
//       status: "fail",
//       message: "heslo neodpovídá.",
//     });
//   }

//   doc = await Day.findById({
//     _id: "62ac66bbd3646f6795485257",
//   });
//   doc2 = doc.monday;
//   console.log(doc2);
//   doc2 = doc2.filter((el) => {
//     return el !== username;
//   });
//   console.log(doc2);
//   // switch (req.body.day) {
//   //   case "monday":
//   //     doc2.push(username);
//   //     break;
//   //   case "tuesday":
//   //     TUESDAY.push(username);
//   //     break;
//   // }

//   await Day.updateOne(
//     { _id: "62ac66bbd3646f6795485257" },
//     { $set: { monday: doc2 } }
//   );

//   res.json({
//     message: "Zrušen termín.",
//   });
// });

// SERVER LISTEN

app.listen(port, () => console.log(`Node server listening on port: ${port}!`));
