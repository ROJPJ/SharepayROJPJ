const events = require("../entities/events.js");
const uuidv4 = require("uuid/v4");

function getEvents(request, result) {
  events.findAll()
  .then((dbresult) => {
    result.render("events", {rows: dbresult});
  });
}

function getAddEvent(request, result) {
    result.render("event", {user: request.user});
}

function saveEvent(request, result){
  let event = request.body;
  event.id = uuidv4();
  const currentdate = new Date();
  const year = currentdate.getFullYear();
  const month = "0" + currentdate.getMonth();
  const day = "0" + currentdate.getDay();
  event.date = `${year}-${month.substr(-2, 2)}-${day.substr(-2, 2)}`;
  event.status_id = "O";
  events.insertEvent(event)
  .then((event) => {
    result.render("eventExpenses", event);
  })
  .catch((error) => {
    console.warn(error);
  });
}

module.exports = {
  getEvents: getEvents,
  getAddEvent: getAddEvent,
  saveEvent: saveEvent
}
