const events = require("../entities/events.js");

function getEvents(request, result) {
  events.findAll()
  .then((dbresult) => {
    result.render("events", {rows: dbresult});
  });
}

function getAddEvent(request, result) {
  result.render("event", {user: request.user});
}

function getUpdateEvent(request, result) {
  events.getEvent(request.params.id)
  .then((row) => {
    result.render("event", {user: request.user, event: row});
  });
}

function saveEvent(request, result){
  let event = request.body;

  event.delete = (event.btnDelete !== undefined);
  const currentdate = new Date();
  const year = currentdate.getFullYear();
  const month = "0" + currentdate.getMonth();
  const day = "0" + currentdate.getDay();
  event.date = `${year}-${month.substr(-2, 2)}-${day.substr(-2, 2)}`;

  if (!event.status_id) {
    event.status_id = "O";
  }

  events.saveEvent(event)
  .then((saved) => {
    if (event.delete) {
      getEvents(request, result);
    } else {
      result.render("eventExpenses", event);
    }
  })
  .catch((error) => {
    console.warn(error);
  });
}

module.exports = {
  getEvents: getEvents,
  getAddEvent: getAddEvent,
  getUpdateEvent: getUpdateEvent,
  saveEvent: saveEvent
}
