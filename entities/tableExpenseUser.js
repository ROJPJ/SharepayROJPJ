const PG = require("pg");

function findUserIdByExpenseId(expenseId) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
  client.connect();
  return client.query("SELECT DISTINCT user_id FROM public.expense_user where expense_id=$1::uuid", [expenseId])
  .then((result) => result.rows)
  .then((data) => {
      client.end();
      return data;
    })
    .catch((error) => {
      client.end();
      console.warn(error);
    });
}

module.exports = {
  findUserIdByExpenseId: findUserIdByExpenseId
};
