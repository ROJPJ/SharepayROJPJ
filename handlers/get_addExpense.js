function getAddExpense(request, result) {
  console.log(request.body);
    result.render("expense", request.body);
}

module.exports = getAddExpense;
