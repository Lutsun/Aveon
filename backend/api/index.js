const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://aveon-frontend.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// Routes API
app.use("/products", productRoutes);

app.get("/test", (req, res) => {
  res.json({ message: "API OK" });
});

// Route test
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Gestion erreur 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} non trouvée`
  });
});

// Export pour Vercel
module.exports = app;