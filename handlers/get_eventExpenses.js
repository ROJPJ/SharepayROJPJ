const events = require("../entities/eventExpenses.js");

function getEventExpenses(request, result) {
  events.findEventById(request.params.id)
  .then((event) => {
    result.render("eventExpenses", event);
  });
}

module.exports = {
  getEventExpenses: getEventExpenses,
}
