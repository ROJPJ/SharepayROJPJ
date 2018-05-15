const PG = require("pg");

function getAddEvent(request, result) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
  client.connect();
  client.query("SELECT * FROM public.event", [])
    .then((dbresult) => {
      client.end();
      result.render("addEvent", {rows: dbresult.rows});
    })
    .catch((error) => {
      client.end();
      console.log(error);
      result.render("addEvent", error);
    });
}

module.exports = getAddEvent;
