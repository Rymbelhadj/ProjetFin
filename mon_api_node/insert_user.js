const db = require('./db');
const bcrypt = require('bcrypt');

const email = 'nodejs@example.com';
const password = bcrypt.hashSync('123456', 10);
const roles = JSON.stringify(['ROLE_USER']);

db.query(
  "INSERT INTO utilisateurs (email, password, roles) VALUES (?, ?, ?)",
  [email, password, roles],
  (err, result) => {
    if (err) {
      console.error("Erreur d'insertion :", err.message);
    } else {
      console.log("Utilisateur ajouté avec ID :", result.insertId);
    }
    process.exit();
  }
);