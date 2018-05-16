const express = require("express");
const nunjucks = require("nunjucks");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

const Events = require("./handlers/get_events.js");

const getEventExpenses = require("./handlers/get_eventExpenses.js");
const getAddExpense = require("./handlers/get_addExpense.js");
const getUpdateExpense = require("./handlers/get_updateExpense.js");
const Users = require("./handlers/users.js");


const app = express();
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-parser")());
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "njk");

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.use(
  require("express-session")({
    secret: "i4ms3cre7",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, callback) {
  return callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  return callback(null, {"user_id": id});
});

passport.use(new LocalStrategy(
  function(email, password, callback) {
      Users.findByMail(email, function(error, user) {
        if (error) {
          return callback(error);
        }
        if (!user) {
          console.log(`the email ${email} is unknown.`);
          return callback(null, false);
        }
        if (user.mp != password) {
          console.log(`bad password.`);
          return callback(null, false);
        }
        return callback(null, user);
      });
  }
));

app.get("/register", function(request, result) {
  result.render("register");
});

app.post("/register", function(request, result) {
  const user = request.body;
  if (user.password != user.passwordConfirm) {
    console.log("password and confirmed password are different.");
    return result.redirect("/register");
  }
  Users.create(user, function(error, user) {
    if (user) {
      console.log(`Successfully registered user with email: ${user.mail}`);
      request.logIn(user, function(error) {
        if (error) {
          console.log(error);
          return result.redirect("/register");
        }
        return result.redirect("/");
      });
    }
    if (error) {
      console.log(error);
      return result.redirect("/register");
    }
  });
});

//--- this route display the login page
app.get("/login", function(request, result) {
  result.render("login");
});

//--- this route is used when a user set his mail and password
app.post("/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function(request, result) {
    const user = request.body;
    console.log(`Successfully login user with email: ${user.username}`)
    result.redirect("/");
  }
);

app.get("/logout", function(request, result) {
  request.logout();
  result.redirect("/");
});

app.get("/profile",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  function(request, result) {
    result.render("profile", {
      id: request.user.id,
      name: request.user.displayName,
      email: request.user.email
    });
});

app.get("/",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  Events.getEvents);

app.get("/event/new",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  Events.getAddEvent
);
app.post("/event/new",
require("connect-ensure-login").ensureLoggedIn("/login"),
 Events.saveEvent);

app.get("/event/:id",
require("connect-ensure-login").ensureLoggedIn("/login"),
 getEventExpenses.getEventExpenses);

app.post("/expense/add",
require("connect-ensure-login").ensureLoggedIn("/login"),
 getAddExpense);

app.post("/expense/save",
require("connect-ensure-login").ensureLoggedIn("/login"),
 getEventExpenses.saveExpense);

app.get("/expense/:id", getUpdateExpense);



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
