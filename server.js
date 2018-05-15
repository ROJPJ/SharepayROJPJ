const express = require("express");
const nunjucks = require("nunjucks");

const getEvents = require("./handlers/get_events.js");
const getAddEvent = require("./handlers/get_addEvent.js");

const app = express();
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "njk");

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.get("/", getEvents);
app.get("/toto", getAddEvent);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
