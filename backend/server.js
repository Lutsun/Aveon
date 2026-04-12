// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// 🔧 CORS configuré pour fonctionner avec Vercel et local
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://aveon.vercel.app",
  "https://aveon-git-main.vercel.app",
  "https://aveon.vercel.app",
  // Ajoute ton domaine Vercel réel après déploiement
];

app.use(cors({
  origin: function(origin, callback) {
    // Permettre les requêtes sans origin (ex: mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      console.log("❌ CORS bloqué pour:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
  exposedHeaders: ["Set-Cookie"]
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// CONNEXION SYNCHRONE AVEC AWAIT
async function startServer() {
  try {
    console.log("🔗 Connexion à MongoDB...");
    
    await connectDB();
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB non connecté");
    }
    
    console.log(`✅ MongoDB prêt (état: ${mongoose.connection.readyState})`);
    
    // Routes
    app.use("/api/produits", require("./routes/productRoutes"));
    app.use("/api/commandes", require("./routes/commandeRoutes"));
    app.use("/api/customers", require("./routes/customerRoutes"));
    app.use("/api/notifications", require("./routes/notifications"));
    
    // Route de test
    app.get("/", (req, res) => {
      res.send(`Backend Aveon connecté à MongoDB ✅ (État: ${mongoose.connection.readyState})`);
    });
    
    // Route health check pour Vercel
    app.get("/api/health", (req, res) => {
      res.json({ 
        status: "OK", 
        message: "AVEON API is running!",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
      });
    });
    
    // Error handling
    app.use((err, req, res, next) => {
      console.error("Server error:", err);
      res.status(500).json({ error: err.message });
    });
    
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`🛒 Serveur Aveon en marche`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📍 API Produits: http://localhost:${PORT}/api/produits`);
      console.log(`📍 API Commandes: http://localhost:${PORT}/api/commandes`);
      console.log(`📍 API Customers: http://localhost:${PORT}/api/customers`);
      console.log(`📍 API Notifications: http://localhost:${PORT}/api/notifications`);
      console.log(`📍 MongoDB: ${mongoose.connection.host}`);
      console.log(`=================================`);
    });
    
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;