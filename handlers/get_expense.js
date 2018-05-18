const Expenses = require("../entities/tableExpense.js");
const Events = require("../entities/events.js");
const EventExpenses = require("../entities/eventExpenses.js");

function getAddExpense(request, result) {
  Events.getEvent(request.body.id)
  .then((event) => {
    event.event_label = event.label;
    event.event_id = event.id;
    event.label = "";
    event.id = "";
    event.amount = 0;
    result.render("expense", event);
  });
}

function getUpdateExpense(request, result) {
  Expenses.getEventExpense(request.params.id)
  .then((dbresult) => {
    dbresult.users.map((user) => { user.checked = user.expense_user_id ? "CHECKED" : ""});
    result.render("expense", dbresult);
  });
}

function saveExpense(request, result){
  let expense = request.body;
  expense.delete = (expense.btnDelete !== undefined);
  const currentdate = new Date();
  const year = currentdate.getFullYear();
  const month = "0" + currentdate.getMonth();
  const day = "0" + currentdate.getDay();
  expense.date = `${year}-${month.substr(-2, 2)}-${day.substr(-2, 2)}`;
  expense.amount = expense.amount * 100;

  Expenses.saveExpense(expense)
  .then((dbresult) => {
    EventExpenses.findEventById(expense.event_id)
    .then((event) => {
      result.render("eventExpenses", event);
    });
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
