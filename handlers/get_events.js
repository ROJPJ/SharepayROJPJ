const events = require("../entities/events.js");

function getEvents(request, result) {
  events.findAll()
  .then((dbresult) => {
    result.render("events", {rows: dbresult});
  });
}

module.exports = getEvents;
