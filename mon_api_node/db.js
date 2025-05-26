const mysql = require('mysql2');
const config = require('./config');

const connection = mysql.createConnection({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  charset: config.DB_CHARSET
});

connection.connect(err => {
  if (err) {
    console.error("Erreur de connexion MySQL :", err.message);
    process.exit(1);
  } else {
    console.log("Connexion MySQL réussie !");
  }
});

module.exports = connection;
