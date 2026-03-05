require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); 
const connectDB = require("./config/db");

const app = express();

// Middleware CORS pour autoriser les requêtes du frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// CONNEXION SYNCHRONE AVEC AWAIT
async function startServer() {
  try {
    console.log("🔗 Connexion à MongoDB...");
    
    // Connectez-vous AVANT de définir les routes
    await connectDB();
    
    // Vérifiez que la connexion est active
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB non connecté");
    }
    
    console.log(`✅ MongoDB prêt (état: ${mongoose.connection.readyState})`);
    
    // Routes (UNIQUEMENT après connexion MongoDB)
    app.use("/api/produits", require("./routes/productRoutes"));
    app.use("/api/commandes", require("./routes/commandeRoutes")); 
    app.use("/api/notifications", require("./routes/notifications")); 
    
    // Route de test
    app.get("/", (req, res) => {
      res.send(`Backend Aveon connecté à MongoDB ✅ (État: ${mongoose.connection.readyState})`);
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
      console.log(`📍 API Notifications: http://localhost:${PORT}/api/notifications`);
      console.log(`📍 MongoDB: ${mongoose.connection.host}`);
      console.log(`=================================`);
    });
    
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur:", error);
    process.exit(1);
  }
}

// Démarrez le serveur
startServer();

module.exports = app;