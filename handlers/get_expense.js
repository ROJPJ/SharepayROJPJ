const expense = require("../entities/tableExpense.js");
const events = require("../entities/events.js");
const uuidv4 = require("uuid/v4");

function getAddExpense(request, result) {
  events.getEvent(request.body.id)
  .then((event) => {
    event.event_label = event.label;
    event.event_id = event.id;
    event.label = "";
    event.id = "";
    result.render("expense", event);
  });
}

function getUpdateExpense(request, result) {
  expense.getEventExpense(request.params.id)
  .then((dbresult) => {
    dbresult.users.map((user) => { user.checked = user.expense_user_id ? "CHECKED" : ""});
    console.log("getUpdateExpense", dbresult);
    result.render("expense", dbresult);
  });
}

function saveExpense(request, result){
  let expense = request.body;
  const currentdate = new Date();
  const year = currentdate.getFullYear();
  const month = "0" + currentdate.getMonth();
  const day = "0" + currentdate.getDay();
  expense.date = `${year}-${month.substr(-2, 2)}-${day.substr(-2, 2)}`;

  expense.saveExpense(expense)
  .then((expense) => {
    result.render("eventExpenses", expense);
  })
  .catch((error) => {
    console.warn(error);
  });
}

module.exports = {
  getAddExpense: getAddExpense,
  getUpdateExpense: getUpdateExpense,
  saveExpense: saveExpense
};
