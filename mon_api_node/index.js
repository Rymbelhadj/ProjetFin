const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Votre connexion MySQL existante

const app = express();

// Configuration CORS améliorée
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:50080', 'http://localhost:50512', 'http://127.0.0.1:50512', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware pour gérer les requêtes OPTIONS préliminaires
app.options('*', cors());

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Middleware pour logger les requêtes de manière plus détaillée
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  // Intercepter la réponse pour logger son statut
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`Response status: ${res.statusCode}`);
    return originalSend.call(this, body);
  };
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

// Route pour récupérer tous les projets
app.get("/api/projects", (req, res) => {
  // Données fictives pour le développement
  const mockProjects = [
    {
      id: 1,
      name: "Projet Web",
      description: "Développement d'un site web responsive",
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Application Mobile",
      description: "Création d'une application mobile cross-platform",
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  res.status(200).json(mockProjects);
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API accessible à http://localhost:${PORT}/api`);
});
