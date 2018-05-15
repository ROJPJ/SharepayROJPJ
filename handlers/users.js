const PG = require("pg");

function findByMail(username, result) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
  client.connect();
  client.query("SELECT * FROM public.user WHERE mail = $1::text", [username])
    .then((dbresult) => {
      client.end();
      return result(null, dbresult.rows[0]);
    })
    .catch((error) => {
      client.end();
      return result(error, null);
    });
}

function create(user, result) {
  const client = new PG.Client({
    connectionString: process.env.DATABASE_URL,
    //ssl: true,
  });
  client.connect();
  client.query("INSERT INTO public.user (name, mail, mp) VALUES ($1, $2, $3)",
    [user.name, user.mail, user.password])
    .then((dbresult) => {
      client.end();
      return result(null, user);
    })
    .catch((error) => {
      client.end();
      return result(error, null);
    });
}

// findByMail("jeanphilippe.bornier@decathlon.com",
//   function(result) {
//     console.log(result);
//   }
// );

module.exports = {
  findByMail: findByMail,
  create: create
};
