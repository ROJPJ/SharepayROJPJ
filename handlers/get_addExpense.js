function getAddExpense(request, result) {
    result.render("expense", {rows: {}});
}

module.exports = getAddExpense;
