const PG = require("pg");
const uuidv4 = require("uuid/v4");

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

function getUserByMail(userMail) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "SELECT * from public.user WHERE mail=$1::varchar",
    [userMail])
    .then((result) => result.rows[0])
    .then((data) => {
      client.end();
      return data;
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
}

function getUserByName(userName) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "SELECT * from public.user WHERE name=$1::varchar",
    [userName])
    .then((result) => result.rows[0])
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

function getUserByNameWithCreate(userName) {
  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "SELECT * from public.user WHERE name=$1::varchar",
    [userName])
    .then((dbresult) => {
      if (dbresult.rowCount === 0) {
        return insertUser({name: userName});
      } else {
        return dbresult.rows[0];
      }
    })
    .then((data) => {
      client.end();
      return data;
    })
    .catch((error) => {
      client.end();
      console.warn(error);
    });
}

//getUserByNameWithCreate("titi").then((data) => {console.log(data);});

function insertUser(user) {
  user.id = uuidv4();

  const client = new PG.Client(process.env.DATABASE_URL);
  client.connect();
  return client.query(
    "INSERT INTO public.user (id, name, mail, id_fb) VALUES ($1::uuid, $2::varchar, $3::varchar, $4::varchar)",
    [user.id, user.name, user.mail, user.id_fb])
    .then((data) => {
      client.end();
      return user;
    })
    .catch((error) => {
      console.warn(error);
      client.end();
    });
}

module.exports = {
  getUserById: getUserById,
  getUserByMail: getUserByMail,
  insertUser: insertUser,
  updateUser: updateUser,
  getUserByName: getUserByName,
  getUserByNameWithCreate: getUserByNameWithCreate
}
