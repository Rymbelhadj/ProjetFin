const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Votre connexion MySQL existante

const app = express();

// Configuration CORS pour permettre les requêtes depuis l'application web
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:50080', 'http://localhost:55555'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Route de test
app.get("/api", (req, res) => {
  res.json({ message: "API Node.js fonctionne correctement!" });
});

// Route d'inscription
app.post("/api/register", (req, res) => {
  console.log("Requête d'inscription reçue:", req.body);
  
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }
  
  // Insérer l'utilisateur dans la base de données MySQL
  const roles = JSON.stringify(['ROLE_USER']);
  
  db.query(
    "INSERT INTO utilisateurs (name, email, password, roles) VALUES (?, ?, ?, ?)",
    [name, email, password, roles],
    (err, result) => {
      if (err) {
        console.error("Erreur d'insertion :", err.message);
        return res.status(500).json({ message: "Erreur lors de l'inscription", error: err.message });
      }
      
      // Utilisateur créé avec succès
      res.status(201).json({
        token: "user-token-" + result.insertId,
        user: {
          id: result.insertId,
          name: name,
          email: email,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
          role: 'ROLE_USER'
        }
      });
    }
  );
});

// Route de connexion
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  
  db.query(
    "SELECT * FROM utilisateurs WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Erreur de requête :", err.message);
        return res.status(500).json({ message: "Erreur lors de la connexion" });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }
      
      const user = results[0];
      
      // Vérification simple du mot de passe (à remplacer par bcrypt en production)
      if (password !== user.password) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }
      
      // Connexion réussie
      res.status(200).json({
        token: "user-token-" + user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
          role: user.role || 'ROLE_USER'
        }
      });
    }
  );
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API accessible à http://localhost:${PORT}/api`);
});
