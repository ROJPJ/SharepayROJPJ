const PG = require("pg");
const uuidv4 = require("uuid/v4");
const tableUser = require("../entities/tableUser.js");
const tableExpense = require("../entities/tableExpense.js");

function findAll() {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "SELECT * FROM public.event",
    [])
    .then((result) => result.rows)
    .then((data) => {
      client.end();
      return data;
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
}

function getEvent(id) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();

  return client.query(
    "SELECT * FROM public.event WHERE id=$1::uuid",
    [id])
    .then((result) => result.rows[0])
    .then((event) => {
      return client.query(
        "SELECT id, name FROM public.event_user e INNER JOIN public.user u ON e.user_id=u.id WHERE event_id=$1::uuid",
        [event.id])
        .then((result) => {
          event.users = result.rows;
          return event;
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

function saveEvent(event) {
  if (event.user !== undefined) {
    if (event.user.constructor !== Array) {
      event.user = [event.user];
    }
  }

  if (event.delete) {
    return deleteEvent(event);
  } else if (!event.id) {
    event.id = uuidv4();
    return insertEvent(event);
  }
  else {
    return updateEvent(event);
  }
}

function updateEvent(event) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();

  return client.query(
    "UPDATE event SET label=$2::varchar, description=$3::varchar, date=$4::date, user_id=$5::uuid WHERE id=$1::uuid",
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

function insertEvent(event) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "INSERT INTO event (id, label, description, date, user_id, status_id) values ($1::uuid, $2::varchar, $3::text, $4::date, $5::uuid, $6::varchar)",
    [event.id, event.label, event.description, event.date, event.user_id, event.status_id])
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

function saveUserEvent(event_id, userName) {
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

function deleteEvent(event) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "SELECT id FROM public.expense WHERE event_id=$1::uuid",
    [event.id])
  .then((expenses) => {
    return expenses.rows.forEach((expense) => tableExpense.deleteExpense(expense))
  })
  .then((deleted) => {
    return client.query(
      "DELETE FROM public.event_user WHERE event_id=$1::uuid",
      [event.id])
    .then((deleted) => {
      return client.query(
        "DELETE FROM public.event WHERE id=$1::uuid",
        [event.id])
        .then((deleted) => {
          client.end();
          return true;
        });
    })
  })
  .catch((error) => {
    console.warn("Event DELETE", error);
    client.end();
    return false;
  });
}

module.exports = {
  findAll: findAll,
  getEvent: getEvent,
  saveEvent: saveEvent,
  saveUserEvent: saveUserEvent
};
