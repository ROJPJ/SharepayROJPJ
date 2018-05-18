const PG = require("pg");

function findEventById(id) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
  client.connect();
  return client.query("SELECT * FROM public.event where id=$1::uuid", [id])
  .then((result) => result.rows[0])
  .then((event) => {
    return client.query(
      "SELECT * FROM public.expense x WHERE event_id=$1::uuid",
      [event.id])
      .then((result) => {
        event.expenses = result.rows;
        return event;
      });
  })
  .then((data) => {
      client.end();
      return data;
    })
    .catch((error) => {
      client.end();
      console.warn(error);
    });
}

function insertExpense(expense) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  console.log(expense);
  return client.query(
    "INSERT INTO expense (id,label,event_id,amount,date,user_id) values ($1::uuid, $2::varchar, $3::uuid, $4::integer, $5::date, $6::uuid)",
    [expense.id, expense.label, expense.event_id, expense.amount, expense.date, expense.user_id])
    .then((data) => {
      client.end();
      return data;
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
}

module.exports = {
  findEventById: findEventById,
  insertExpense: insertExpense
};
