const events = require("../entities/eventExpenses.js");
const uuidv4 = require("uuid/v4");

function getEventExpenses(request, result) {
  events.findEventById(request.params.id)
  .then((event) => {
    result.render("eventExpenses", event);
  });
}

function saveExpense(request, result){
  let expense = request.body;
  expense.id = uuidv4();
  const currentdate = new Date();
  const year = currentdate.getFullYear();
  const month = "0" + currentdate.getMonth();
  const day = "0" + currentdate.getDay();
  expense.date = `${year}-${month.substr(-2, 2)}-${day.substr(-2, 2)}`;
  events.insertExpense(expense)
  .then((expense) => {
    result.render("expense", expense);
  })
  .catch((error) => {
    console.warn(error);
  });
}

module.exports = {
  getEventExpenses: getEventExpenses,
  saveExpense: saveExpense
}
