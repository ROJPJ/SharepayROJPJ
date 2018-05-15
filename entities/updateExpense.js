const PG = require("pg");

function findById(id) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
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

module.exports = {findById:findById};
