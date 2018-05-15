const events = require("../entities/updateExpense.js");

function getUpdateExpense(request, result) {
  events.findById(request.params.id)
  .then((dbresult) => {
    result.render("expense", {rows: dbresult});
  });
}

module.exports = getUpdateExpense;
