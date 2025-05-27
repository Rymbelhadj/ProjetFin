const db = require('./db');
const bcrypt = require('bcrypt');

// Création d'un compte administrateur
const adminUser = {
  name: 'Admin User',
  email: 'admin@exemple.com',
  password: bcrypt.hashSync('password', 10),
  avatar_url: 'https://ui-avatars.com/api/?name=Admin+User',
  role: 'admin'
};

// Création d'un compte utilisateur standard
const regularUser = {
  name: 'Regular User',
  email: 'user@exemple.com',
  password: bcrypt.hashSync('password', 10),
  avatar_url: 'https://ui-avatars.com/api/?name=Regular+User',
  role: 'user'
};

// Insertion de l'administrateur
db.query(
  "INSERT INTO users (name, email, password, avatar_url, role) VALUES (?, ?, ?, ?, ?)",
  [adminUser.name, adminUser.email, adminUser.password, adminUser.avatar_url, adminUser.role],
  (err, result) => {
    if (err) {
      console.error("Erreur d'insertion admin:", err.message);
    } else {
      console.log("Utilisateur admin ajouté avec ID:", result.insertId);
      
      // Insertion de l'utilisateur standard après l'admin
      db.query(
        "INSERT INTO users (name, email, password, avatar_url, role) VALUES (?, ?, ?, ?, ?)",
        [regularUser.name, regularUser.email, regularUser.password, regularUser.avatar_url, regularUser.role],
        (err, result) => {
          if (err) {
            console.error("Erreur d'insertion utilisateur:", err.message);
          } else {
            console.log("Utilisateur standard ajouté avec ID:", result.insertId);
          }
          process.exit();
        }
      );
    }
  }
);
