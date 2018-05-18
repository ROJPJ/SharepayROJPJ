const PG = require("pg");
const uuidv4 = require("uuid/v4");
const tableUser = require("../entities/tableUser.js");

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
        `SELECT eu.user_id id, u.name, xu.user_id expense_user_id
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

  return tableUser.getUserByNameWithCreate(expense.user_name).
  then((payer) => {
    expense.user_id = payer.id;
    if (expense.delete) {
      return deleteExpense(expense);
    } else if (!expense.id) {
      expense.id = uuidv4();
      return insertExpense(expense);
    }
    else {
      return updateExpense(expense);
    }
  });
}

function updateExpense(expense) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();

  return client.query(
    `UPDATE expense
      SET label=$2::varchar, amount=$3::integer, date=$4::date, user_id=$5::uuid
      WHERE id=$1::uuid`,
    [expense.id, expense.label, expense.amount, expense.date, expense.user_id])
    .then((data) => {
      expense.user.forEach((user) => {
        saveUserExpense(expense.id, user, (expense.check[user] === 'on'))
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
    `INSERT INTO expense (id, label, amount, date, user_id, event_id)
     values ($1::uuid, $2::varchar, $3::integer, $4::date, $5::uuid, $6::uuid)`,
     [expense.id, expense.label, expense.amount, expense.date, expense.user_id, expense.event_id])
    .then((data) => {
      expense.user.forEach((user) => {
        saveUserExpense(expense.id, user, (expense.check[user] === 'on'))
      });
      client.end();
      return data;
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
}

function saveUserExpense(expense_id, user_id, checked) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();

  return client.query(
    "SELECT * FROM public.expense_user WHERE expense_id=$1::uuid AND user_id=$2::uuid",
    [expense_id, user_id])
  .then((rows) => {
    if (rows.rowCount === 0 && checked) {
      return client.query(
        "INSERT INTO public.expense_user (expense_id, user_id) VALUES ($1::uuid, $2::uuid)",
        [expense_id, user_id])
      .then((inserted) => {
        client.end();
        return true;
      })
      .catch((error) => {
        console.warn("saveUserExpense INSERT", error);
        client.end();
        return false;
      });
    } else if (rows.rowCount > 0 && !checked) {
      return client.query(
        "DELETE FROM public.expense_user WHERE expense_id=$1::uuid AND user_id=$2::uuid",
        [expense_id, user_id])
      .then((deleted) => {
        client.end();
        return true;
      })
      .catch((error) => {
        console.warn("saveUserExpense DELETE", error);
        client.end();
        return false;
      });
    }
  })
  .catch((error) => {
    console.warn(error);
    client.end();
  });
}

function deleteExpense(expense) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "DELETE FROM public.expense_user WHERE expense_id=$1::uuid",
    [expense.id])
  .then((deleted) => {
    return client.query(
      "DELETE FROM public.expense WHERE id=$1::uuid",
      [expense.id])
      .then((deleted) => {
        client.end();
        return true;
      });
  })
  .catch((error) => {
    console.warn("Expense DELETE", error);
    client.end();
    return false;
  });
}

module.exports = {
  findById: findById,
  findEventId: findEventId,
  getEventExpense: getEventExpense,
  saveExpense: saveExpense,
  deleteExpense: deleteExpense
};
