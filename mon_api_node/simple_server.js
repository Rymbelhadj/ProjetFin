const express = require('express');
const cors = require('cors');
const app = express();

// Configuration CORS très permissive pour le débogage
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*'
}));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route de test simple
app.get("/api", (req, res) => {
  res.json({ message: "API fonctionne!" });
});

// Route de connexion simplifiée
app.post("/api/login", (req, res) => {
  console.log("Requête de connexion reçue:", req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  
  // Pour le développement, accepter n'importe quel email/mot de passe
  // ou vérifier des identifiants spécifiques
  if (email === "admin@exemple.com" && password === "password") {
    console.log("Connexion réussie pour admin");
    return res.status(200).json({
      token: "admin-token-123",
      id: "123",
      name: "Admin User",
      email: email,
      avatarUrl: `https://ui-avatars.com/api/?name=Admin+User`,
      role: 'admin'
    });
  } else if (email === "user@exemple.com" && password === "password") {
    console.log("Connexion réussie pour utilisateur standard");
    return res.status(200).json({
      token: "user-token-456",
      id: "456",
      name: "Regular User",
      email: email,
      avatarUrl: `https://ui-avatars.com/api/?name=Regular+User`,
      role: 'user'
    });
  }
  
  // Si les identifiants ne correspondent pas
  console.log("Échec de connexion: identifiants incorrects");
  return res.status(401).json({ message: "Email ou mot de passe incorrect" });
});

// Route pour récupérer les projets
app.get("/api/projects", (req, res) => {
  console.log("Requête de récupération des projets reçue");
  
  // Données fictives pour les projets
  const mockProjects = [
    {
      id: 1,
      name: "Projet Web",
      description: "Développement d'un site web responsive",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Application Mobile",
      description: "Création d'une application mobile cross-platform",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  res.status(200).json(mockProjects);
});

// Route pour récupérer un projet par ID
app.get("/api/projects/:id", (req, res) => {
  const projectId = req.params.id;
  console.log(`Requête de récupération du projet ${projectId}`);
  
  // Données fictives pour le projet
  const mockProject = {
    id: projectId,
    name: "Projet " + projectId,
    description: "Description du projet " + projectId,
    owner_id: "1",
    member_ids: ["1", "2"],
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json(mockProject);
});

// Route pour créer un projet
app.post("/api/projects", (req, res) => {
  console.log("Requête de création de projet reçue");
  console.log("Corps de la requête:", req.body);
  
  // Créer un projet fictif avec un ID généré
  const newProject = {
    ...req.body,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.status(201).json(newProject);
});

// Route pour mettre à jour un projet
app.put("/api/projects/:id", (req, res) => {
  const projectId = req.params.id;
  console.log(`Requête de mise à jour du projet ${projectId}`);
  console.log("Corps de la requête:", req.body);
  
  // Mettre à jour le projet fictif
  const updatedProject = {
    ...req.body,
    id: projectId,
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json(updatedProject);
});

// Route pour supprimer un projet
app.delete("/api/projects/:id", (req, res) => {
  const projectId = req.params.id;
  console.log(`Requête de suppression du projet ${projectId}`);
  
  // Simuler une suppression réussie
  res.status(204).send();
});

// Route pour récupérer les projets (admin)
app.get("/api/admin/projects", (req, res) => {
  console.log("Requête de récupération des projets (admin) reçue");
  
  // Données fictives pour les projets
  const mockProjects = [
    {
      id: 1,
      name: "Projet Web Admin",
      description: "Développement d'un site web responsive",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Application Mobile Admin",
      description: "Création d'une application mobile cross-platform",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "API Backend Admin",
      description: "Développement d'une API RESTful",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  res.status(200).json(mockProjects);
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur de test démarré sur le port ${PORT}`);
  console.log(`API accessible à http://localhost:${PORT}/api`);
});







