const PG = require("pg");

function getUserByMail(toto) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "SELECT * from public.user WHERE mail=$1::varchar",
    [toto])
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

function insertUser(name, mail, id_fb) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "INSERT INTO public.user (name, mail, id_fb) VALUES ($1::varchar, $2::varchar, $3::varchar)",
    [name,mail,id_fb])
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

module.exports = {
  getUserByMail: getUserByMail,
  insertUser: insertUser
}
