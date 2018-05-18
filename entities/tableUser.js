const PG = require("pg");

function getUserById(id) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "SELECT * from public.user WHERE id=$1::uuid",
    [id])
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

function getUserByMail(email) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "SELECT * from public.user WHERE mail=$1::varchar",
    [email])
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

function updateUser(email, id_fb) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "UPDATE public.user set id_fb=$2::varchar WHERE mail=$1::varchar",
    [email,id_fb])
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
  getUserById: getUserById,
  getUserByMail: getUserByMail,
  insertUser: insertUser
}
