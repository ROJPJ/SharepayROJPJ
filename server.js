const express = require("express");
const nunjucks = require("nunjucks");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

const getEvents = require("./handlers/get_events.js");
const getAddEvent = require("./handlers/get_addEvent.js");

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
  return callback(null, user.username);
});

passport.deserializeUser(function(email, callback) {
  return callback(null, {"email": email});
});

passport.use(
  new LocalStrategy(function(email, password, callback) {
    callback(null, {"email": email, "password": password});
  })
);

app.get("/register", function(request, result) {
  result.render("register");
});

app.post("/register", function(request, result) {
  const user = request.body;
  console.log(`Successfully registered user with email: ${user.username}`)
  request.logIn(user, function(error) {
    if (error) {
      console.log(error);
      return result.redirect("/register");
    }
    return result.redirect("/");
  });
});

app.get("/login", function(request, result) {
  result.render("login");
});

app.post("/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function(request, result) {
    result.redirect("/profile");
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
  getEvents);

app.get("/toto", getAddEvent);


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
