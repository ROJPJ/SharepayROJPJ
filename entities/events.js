const PG = require("pg");

const client = new PG.Client(process.env.DATABASE_URL);
client.connect();

function findAll() {
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

function addId(label,event_id,amount,date,user_id) {
  client.query(
    "INSERT INTO event (label,event_id,amount,date,user_id) values ($1::uuid, $2::integer, $3::varchar)",
    [categories[indice].id, categories[indice].decathlon_id, categories[indice].label],
    function(error, result) {
      if (error) {
        console.warn(error);
        client.end();
      } else {
        indice++;
        if (indice<categories.length) {
          insertNextCategorie(client, categories, indice);
        } else {
          console.log("INSERT CATEGORIES OK : " + indice + " lines inserted.");
          client.end();
        }
      }
    }
  );
}


module.exports = {
  findAll: findAll,
  updateId: updateId,
  addId: addId
};
