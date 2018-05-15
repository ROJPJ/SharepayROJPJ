const events = require("../entities/eventExpenses.js");

function getEventExpenses(request, result) {
  events.findById(request.params.id)
  .then((dbresult) => {
    result.render("eventExpenses", {rows: dbresult});
  });
}

module.exports = getEventExpenses;
