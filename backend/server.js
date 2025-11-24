require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/produits", require("./routes/productRoutes"));

// Route de test
app.get("/", (req, res) => res.send("Backend Aveon connecté à MongoDB ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🛒 Serveur Aveon en marche sur le port ${PORT}`));