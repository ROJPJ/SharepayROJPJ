const PG = require("pg");

function findById(id) {
  const client = new PG.Client({connectionString: process.env.DATABASE_URL});
  client.connect();

  return client.query("SELECT * FROM public.expense where id=$1::uuid", [id])
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

function findEventId(eventId) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
  client.connect();
  return client.query("SELECT * FROM public.expense where event_id=$1::uuid", [eventId])
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

function getEventExpense(id) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();

  return client.query(
    `SELECT x.*, u.name, e.label event_label
     FROM public.expense x INNER JOIN public.user u ON x.user_id=u.id
     INNER JOIN public.event e ON e.id=x.event_id
     WHERE x.id=$1::uuid`,
    [id])
    .then((result) => result.rows[0])
    .then((expense) => {
      return client.query(
        `SELECT eu.user_id event_user_id, u.name, xu.user_id expense_user_id
         FROM public.expense x
         INNER JOIN public.event_user eu ON x.event_id=eu.event_id
         INNER JOIN public.user u ON eu.user_id=u.id
         LEFT JOIN public.expense_user xu ON eu.user_id=xu.user_id and x.id=xu.expense_id
         WHERE x.id=$1::uuid`,
        [id])
        .then((result) => {
          expense.users = result.rows;
          return expense;
        });
    })
    .then((data) => {
      client.end();
      return data;
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
}

function saveExpense(expense){
  if (expense.user !== undefined) {
    if (expense.user.constructor !== Array) {
      expense.user = [expense.user];
    }
  }

  if (!expense.id) {
    expense.id = uuidv4();
    console.log("INSERT Expense", expense);
    return insertExpense(expense);
  }
  else {
    console.log("UPDATE Expense", expense);
    return updateExpense(expense);
  }
}

function updateExpense(expense) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();

  return client.query(
    "UPDATE expense SET label=$2::varchar, description=$3::varchar, date=$4::date, user_id=$5::uuid WHERE id=$1::uuid",
    [event.id, event.label, event.description, event.date, event.user_id])
    .then((data) => {
      event.user.forEach((user) => {
        saveUserEvent(event.id, user)
      });
      client.end();
      return data;
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
}

function insertExpense(expense) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "INSERT INTO event (id, label, description, date, user_id, status_id) values ($1::uuid, $2::varchar, $3::text, $4::date, $5::uuid, $6::varchar)",
    [event.id, event.label, event.description, event.date, event.user_id, event.status_id])
    .then((data) => {
      event.user.forEach((user) => {
        saveUserExpense(event.id, user)
      });
      client.end();
      return data;
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
}

function saveUserExpense(expense_id, userName) {
  return tableUser.getUserByNameWithCreate(userName).
  then((user) => {
    const client = new PG.Client(process.env.DATABASE_URL);
    client.connect();

    return client.query(
      "SELECT * FROM public.event_user WHERE event_id=$1::uuid AND user_id=$2::uuid",
      [event_id, user.id])
    .then((rows) => {
      if (rows.rowCount === 0) {
        return client.query(
          "INSERT INTO public.event_user (event_id, user_id) VALUES ($1::uuid, $2::uuid)",
          [event_id, user.id])
        .then((insert) => {
          client.end();
          return true;
        })
        .catch((error) => {
          console.warn(error);
          client.end();
          return false;
        });
      }
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
  });
}

module.exports = {
  findById: findById,
  findEventId: findEventId,
  getEventExpense: getEventExpense,
  saveExpense: saveExpense
};
