const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const productRoutes = require("../routes/productRoutes");

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

// Connexion MongoDB (évite reconnexion multiple sur Vercel)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connecté");
  } catch (error) {
    console.error("❌ MongoDB error:", error);
  }
};

// Middleware connexion DB
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes (⚠️ PAS de /api ici)
app.use("/products", productRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.url} non trouvée`
  });
});

// Export serverless (OBLIGATOIRE)
module.exports = serverless(app);