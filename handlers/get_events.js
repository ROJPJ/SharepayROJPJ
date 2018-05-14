const PG = require("pg");

function getEvents(request, result) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
  client.connect();
  client.query("SELECT * FROM public.event", [])
    .then((dbresult) => {
      client.end();
      result.render("events", {rows: dbresult.rows});
    })
    .catch((error) => {
      client.end();
      console.log(error);
      result.render("events", error);
    });
}

module.exports = getEvents;
