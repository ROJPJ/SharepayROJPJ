const PG = require("pg");

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

function updateId(id,label,event_id,amount,date,user_id) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  client.query(
    "UPDATE event set label=$2::varchar, event_id=$2::uuid, amount=$3::integer, date=$4::date, user_id=$5::uuid WHERE id=$1::uuid",
    [id,label,event_id,amount,date,user_id])
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

function insertEvent(event) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "INSERT INTO event (id,label,description,date,user_id, status_id) values ($1::uuid, $2::varchar, $3::text, $4::date, $5::uuid, $6::varchar)",
    [event.id, event.label, event.description, event.date, event.user_id, event.status_id])
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
  findAll: findAll,
  updateId: updateId,
  insertEvent: insertEvent
};
