const expense = require("../entities/updateExpense.js");
const expenseUser = require("../entities/tableExpenseUser.js");
const eventUser = require("../entities/tableEventUser.js");
const user = require("../entities/tableUser.js");
const payback = require("../handlers/payback.js");


function getEventExpenses(request, result) {
  var promise1 = recipientPerExpense(request.params.id);
  var promise2 = userEventList(request.params.id);

  Promise.all([promise1,promise2]).then(function(values) {
    console.log("Result createTransaction: ",values);
    console.log("Result payback: ",payback.payback(values[0],values[1]));

    let balance = payback.payback(values[0],values[1]);
    var promise3 = Promise.all(mapIdFrom(balance));
    var promise4 = Promise.all(mapIdTo(balance));

    Promise.all([promise3,promise4]).then(function(values2) {
      console.log("Result final pour affichage= ",balance);
      result.render("balance", {rows: balance});
    })
  })

}

function recipientPerExpense(expenseId) {
  return expense.findEventId(expenseId)
  .then((expensesForEvent) => {

    var promises = expensesForEvent.map(expense => {
      return expenseUser.findUserIdByExpenseId(expense.id)
      .then((userIdForExpense) => {
          return userIdForExpense.map(value => value.user_id);
        });
    });

    return Promise.all(promises).then(function(recipient) {
      let res = recipient.map((recipient,index) => payback.createTransaction(expensesForEvent[index].user_id, expensesForEvent[index].amount, recipient))
      return res;
    });
  });
}

function userEventList(eventId) {
  return eventUser.userByEventId(eventId)
  .then((usersForEvent) => {
    return usersForEvent.map(user => user.user_id);
  });
}

function mapIdFrom(objectToMap) {
  return objectToMap.map(objectFrom => {
    return user.getUserById(objectFrom.from)
    .then((userDetail) => {
      objectFrom.fromName=userDetail[0].name;
      return objectFrom;
    });
  })
}

function mapIdTo(objectToMap) {
  return objectToMap.map(objectTo => {
    return user.getUserById(objectTo.to)
    .then((userDetail) => {
      objectTo.toName=userDetail[0].name;
      return objectTo;
    });
  })
}

module.exports = getEventExpenses;



//////
// Lire toutes les dépenses pour un evnt (dans expense)
// Pour chaque dépense,
//   créer un array "recipient" avec chaque bénéficiaire en lisant la table expense_user

// Pour chaque dépense,
//   alimenter un array "transaction" avec createTransaction('nom_debiteur', montant, recipient)
//
// Lire tous les participants et les stocker dans un array "participants" (via la table event_user)
// Faire un console.log(payback(transaction,participants)); ... dans un 1er temps
// Faire un result.render ensuite

//
// const { createTransaction, payback } = require('./payback');
//
// const cinema = createTransaction('alice', 440, ['alice', 'bob', 'charlie', 'damian']);
// const food = createTransaction('bob', 450, ['bob', 'charlie', 'damian']);
// const taxi = createTransaction('charlie', 100, ['charlie', 'alice']);
// const drinks = createTransaction('damian', 150, ['damian', 'alice', 'bob']);
// const rentDamian = createTransaction('damian', 200, ['alice', 'bob', 'charlie', 'damian']);
// const rentCharlie = createTransaction('charlie', 400, ['alice', 'bob', 'charlie', 'damian']);
//
// const transactions = [cinema, food, taxi, drinks, rentDamian, rentCharlie];
//
//
// console.log(payback(transactions, ['alice', 'bob', 'charlie', 'damian']));
// [ { from: 'damian', to: 'alice', value: 80 },
//   { from: 'damian', to: 'charlie', value: 30 },
//   { from: 'bob', to: 'charlie', value: 10 } ]
