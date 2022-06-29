// const cookieParser = require("cookie-parser");
// const compression = require("compression");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
// const rateLimit = require("express-rate-limit");
// DECLARATIONS
const { check, validationResult } = require("express-validator");
const { promisify } = require("util"); // u "util" použijeme jen jednu metodu, proto můžeme destruct jen ji

const express = require("express");
const router = express.Router();
const app = express();
app.set("view engine", "ejs");
app.set("views", "front/views");
const mongoose = require("mongoose");
const { resolve } = require("path");
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const cookieParser = require("cookie-parser");

app.use(cookieParser()); // - will parse cookies from incoming request
// Copy the .env.example in the root into a .env file in this folder
const env = require("dotenv").config({ path: "./.env" });
const cors = require("cors");

const port = process.env.PORT || 5000;
const User = require("./models/user");
const Day = require("./models/day");
// app.use(express.urlencoded({ extended: false }));
// try {
//   app.use(express.static(process.env.STATIC_DIR));
// } catch (e) {
//   console.log("Missing env file, be sure to copy .env.example to .env");
// }
app.use(express.static(path.resolve(__dirname, "./client/build")));

// app.use(express.json());
// app.use(express.bodyParser());
app.use(cors());

const jwt = require("jsonwebtoken");

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

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // toto je synchronní přístup, více k tomu, jak to dělat asynchronně - komentáře, lekce 129
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); //jwt.sign(payload, secretOrPrivateKey, [options, callback]);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date( // kdy cookies vyprší, v prohlížeči už nebudou uložené
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 //ma milisekudny. 90 dní ode dneška
    ),
    httpOnly: true, // znamená, browser nemůže access a modify it. jen uloží a při každém requestu usera pošle jwt na server; co když chci ale odhlásit uživatele? nemůžu manipulovat s jwt v prohlížeči, ani tedy delete it. proto při /logout requestu pošlu token se stejným jménem (jwt) ale s žádnou hodnotou, žádný token. current jwt bude override. při dalším requestu tedy user pošle prázdný, nebude authenticated a je odhlášen.
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // true = bude fungovat jen při https. při vytváření aplikace nemáme hned https, proto dejme že při produkci takto bude fungovat

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  // user.password = undefined; // v databázi hodnota pořád zůstane, protože teď neukládáme (save())

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

app.post("/prihlasit-se", async (req, res, next) => {
  const { username, password } = req.body;
  // console.log("tad ", req.body.user.name);

  // 1) Check if email and password inputs not blank
  if (!username || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Zadejte jméno a hesloooooo.",
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
});

// app.use(async (req, res, next) => {
//   // 1) Getting token and check of it's there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1]; // standard je nastavit do header Authorization: Bearer kasjfakfaklsfjalf(to je token). tady chceme jen tu druhou část
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   } // pokud není json web token v authorization header (začínajíc "bearer"), podívat se do cookie, jestli jwt není tady

//   if (!token) {
//     res.status(500).json({
//       message: "!token",
//     });
//   }

//   // 2) Verification token
//   try {
//     // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//     var decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decoded); // bar

//     //jwt.verify(token, secretOrPublicKey, [options, callback])
//     // Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid.
//     // promisifying - lekce 131

//     // console.log("decoded", decoded); výsledek: { id: '617d574909f6775ae4cd3f18', iat: 1635620237, exp: 1643396237 }

//     // 3) Check if user still exists (který posílá token).user byl mezitím deleted, ale token pořád existuje. nechci takového přihlásit.
//   } catch (error) {
//     console.log("CHYYBA", error);
//   }
//   const currentUser = await User.findById(decoded.id); // pokud se v kodu dostaneme do tady toho pointu, znamená to, že verification process above byl succesful, jinak by byl error
//   if (!currentUser) {
//     res.status(500).json({
//       message: "!token",
//     });
//   }

//   // // GRANT ACCESS TO PROTECTED ROUTE
//   req.user = currentUser; // current usera chceme použít i v další middleware, proto ho uložíme do req objektu. req a res objekt totiž cestují mezi všemi middlewares, ve všech mám k req a res přístup
//   res.locals.user = currentUser; // abycom pak mohli res.locals použít ve všech templates.
//   next();
// });

app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  console.log(username);
  // console.log("tad ", req.body.user.name);

  // 1) Check if email and password inputs not blank
  if (!username || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Zadejttttttttttte jméno a heslo.",
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

  const user = { name: username };

  // const jwt_token = jwt.sign(user, process.env.JWT_SECRET);
  const jwt_token = generateAccessToken(user);
  // const refresh_token = jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET);

  const cookieOptions = {
    expires: new Date( // kdy cookies vyprší, v prohlížeči už nebudou uložené
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 //ma milisekudny. 90 dní ode dneška
    ),
    httpOnly: true, // znamená, browser nemůže access a modify it. jen uloží a při každém requestu usera pošle jwt na server; co když chci ale odhlásit uživatele? nemůžu manipulovat s jwt v prohlížeči, ani tedy delete it. proto při /logout requestu pošlu token se stejným jménem (jwt) ale s žádnou hodnotou, žádný token. current jwt bude override. při dalším requestu tedy user pošle prázdný, nebude authenticated a je odhlášen.
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // true = bude fungovat jen při https. při vytváření aplikace nemáme hned https, proto dejme že při produkci takto bude fungovat

  res.cookie("jwt", jwt_token, cookieOptions);

  res.json({
    message: "success!",
    jwt_token,
    username,
    user,
    // refresh_token,
  });
});

app.get("/hraci", authenticateToken, (req, res) => {
  res.json({
    hraci: "všichni hráči",
    user: req.user,
  });
});

app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({
    hraci: "všichni hráči úspch",
    user: req.user,
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1] || req.cookies.jwt || false;
  if (!token) return res.json({ message: "neposlal jsi token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.json({ message: "neplatný token" });
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "120" });
}

app.post("/logout", authenticateToken, (req, res) => {
  res.cookie("jwt", "loggedoutcau", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true, // nastavuju jen httpOnly ale ve skutečnosti neposílám žádná sensitive data.
  });

  res.json({
    hraci: "úspěšně odhlášen",
    user: req.user,
  });
});

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
  if (!username) {
    return res.status(400).json({
      status: "fail",
      message: "Zadejte jméno.",
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

  // if (userWithCurrentEmail.password !== password) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "heslo neodpovídá.",
  //   });
  // }

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
