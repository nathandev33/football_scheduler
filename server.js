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
app.use(cors());

const port = process.env.PORT || 5000;
const User = require("./models/user");
const Day = require("./models/day");
app.use(express.static(path.resolve(__dirname, "./client/build")));

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname));
}

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
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

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

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

app.post("/loginn", (req, res) => {
  res.json({ message: "úspěšný login!!!!" });
});

app.get("/loginnn", (req, res) => {
  res.json({ message: "úspěšný loginnn get!!!!" });
});

app.post("/login", authenticateToken, async (req, res) => {
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
  let userWithCurrentEmail;
  try {
    userWithCurrentEmail = await User.findOne({
      username: username,
    });
  } catch (err) {
    consol.log(err);
  }
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
  const user = { name: username };

  // const jwt_token = jwt.sign(user, process.env.JWT_SECRET);
  const jwt_token = generateAccessToken(user);
  // const refresh_token = jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // v browseru za 90 dní.
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", jwt_token, cookieOptions);

  res.status(200).json({
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
    user: req.username,
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
  console.log(token);
  if (!token) return res.json({ message: "neposlal jsi token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.json({ message: "neplatný token", err });
    }
    console.log("valid token");
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 3600 }); // v sec ve 14:26
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

// All other GET requests not handled before will return our React app
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.get("/api", authenticateToken, async (req, res) => {
  console.log("toto je test");
  let dny;
  try {
    console.log("dostal jsem request");
    dny = await Day.findById({
      _id: dayID,
    });
  } catch (err) {
    console.log(err);
  }
  res.json({
    message: "Hello from server!",
    dny,
  });
});

app.post("/create-days", async (req, res) => {
  const days = new Day({});
  await days.save();
  res.send("success");
});

app.post("/", authenticateToken, async (req, res) => {
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

  if (req.body.action == "zapsat-se") {
    console.log("je to zapsat se");

    doc = await Day.findById({
      _id: dayID,
    });
    let monday_ = doc.monday;
    let tuesday_ = doc.tuesday;
    let wednesday_ = doc.wednesday;
    let thursday_ = doc.thursday;
    let friday_ = doc.friday;
    let saturday_ = doc.saturday;
    let sunday_ = doc.sunday;

    console.log("username ", username);
    console.log("den ", req.body.day);
    let zapsany;

    switch (req.body.day) {
      case "monday":
        if (monday_.length > 0) {
          monday_.forEach((el) => {
            if (el.hrac === username) {
              console.log("už jsi zapsaný");
              zapsany = true;
            }
          });
          if (!zapsany) {
            monday_.push({ hrac: username, note: note });
          }
        } else {
          monday_.push({ hrac: username, note: note });
        }
        break;
      case "tuesday":
        if (tuesday_.length > 0) {
          tuesday_.forEach((el) => {
            if (el.hrac === username) {
              console.log("už jsi zapsaný");
              zapsany = true;
            }
          });
          if (!zapsany) {
            tuesday_.push({ hrac: username, note: note });
          }
        } else {
          tuesday_.push({ hrac: username, note: note });
        }
        break;
      case "wednesday":
        if (wednesday_.length > 0) {
          wednesday_.forEach((el) => {
            if (el.hrac === username) {
              console.log("už jsi zapsaný");
              zapsany = true;
            }
          });
          if (!zapsany) {
            wednesday_.push({ hrac: username, note: note });
          }
        } else {
          wednesday_.push({ hrac: username, note: note });
        }
        break;
      case "thursday":
        if (thursday_.length > 0) {
          thursday_.forEach((el) => {
            if (el.hrac === username) {
              console.log("už jsi zapsaný");
              zapsany = true;
            }
          });
          if (!zapsany) {
            thursday_.push({ hrac: username, note: note });
          }
        } else {
          thursday_.push({ hrac: username, note: note });
        }
        break;
      case "friday":
        if (friday_.length > 0) {
          friday_.forEach((el) => {
            if (el.hrac === username) {
              console.log("už jsi zapsaný");
              zapsany = true;
            }
          });
          if (!zapsany) {
            friday_.push({ hrac: username, note: note });
          }
        } else {
          friday_.push({ hrac: username, note: note });
        }
        break;
      case "saturday":
        if (saturday_.length > 0) {
          saturday_.forEach((el) => {
            if (el.hrac === username) {
              console.log("už jsi zapsaný");
              zapsany = true;
            }
          });
          if (!zapsany) {
            saturday_.push({ hrac: username, note: note });
          }
        } else {
          saturday_.push({ hrac: username, note: note });
        }
        break;
      case "sunday":
        if (sunday_.length > 0) {
          sunday_.forEach((el) => {
            if (el.hrac === username) {
              console.log("už jsi zapsaný");
              zapsany = true;
            }
          });
          if (!zapsany) {
            sunday_.push({ hrac: username, note: note });
          }
        } else {
          sunday_.push({ hrac: username, note: note });
        }
        break;
    }

    await Day.updateOne({ _id: dayID }, { $set: { monday: monday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { tuesday: tuesday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { wednesday: wednesday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { thursday: thursday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { friday: friday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { saturday: saturday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { sunday: sunday_ } });

    res.json({
      message: "Jsi zapsán!",
      data: req.body,
      vsechno: {
        monday_,
        tuesday_,
        wednesday_,
        thursday_,
        friday_,
        saturday_,
        sunday_,
      },
    });
  }

  if (req.body.action == "zrusit") {
    console.log("je to zrušit");
    doc = await Day.findById({
      _id: dayID,
    });
    let monday_ = doc.monday;
    let tuesday_ = doc.tuesday;
    let wednesday_ = doc.wednesday;
    let thursday_ = doc.thursday;
    let friday_ = doc.friday;
    let saturday_ = doc.saturday;
    let sunday_ = doc.sunday;

    switch (req.body.day) {
      case "monday":
        monday_ = monday_.filter((el) => {
          return el.hrac !== username;
        });
        break;
      case "tuesday":
        tuesday_ = tuesday_.filter((el) => {
          return el.hrac !== username;
        });
        break;
      case "wednesday":
        wednesday_ = wednesday_.filter((el) => {
          return el.hrac !== username;
        });
        break;
      case "thursday":
        thursday_ = thursday_.filter((el) => {
          return el.hrac !== username;
        });
        break;
      case "friday":
        friday_ = friday_.filter((el) => {
          return el.hrac !== username;
        });
        break;
      case "saturday":
        saturday_ = saturday_.filter((el) => {
          return el.hrac !== username;
        });
        break;
      case "sunday":
        sunday_ = sunday_.filter((el) => {
          return el.hrac !== username;
        });
        break;
    }

    await Day.updateOne({ _id: dayID }, { $set: { monday: monday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { tuesday: tuesday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { wednesday: wednesday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { thursday: thursday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { friday: friday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { saturday: saturday_ } });
    await Day.updateOne({ _id: dayID }, { $set: { sunday: sunday_ } });

    res.json({
      message: "Jsi úspěšně přihlášen!",
      data: req.body,
      vsechno: {
        monday_,
        tuesday_,
        wednesday_,
        thursday_,
        friday_,
        saturday_,
        sunday_,
      },
    });
  }
});

app.listen(port, () => console.log(`Node server listening on port: ${port}!`));
