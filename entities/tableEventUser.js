const PG = require("pg");

function userByEventId(eventId) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
  client.connect();
  return client.query("SELECT user_id FROM public.event_user where event_id=$1::uuid", [eventId])
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
  userByEventId: userByEventId
};
