const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const commandeRoutes = require("./routes/commandeRoutes");
const customerRoutes = require("./routes/customerRoutes");
const notificationRoutes = require("./routes/notifications");

const app = express();

// CORS
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://aveon-frontend.vercel.app",
    "https://aveondakar.shop"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions)); // CORS pour toutes les routes
app.options("*", cors(corsOptions)); // Pré-vol pour toutes les routes


// Middlewares
app.use(express.json());
app.use(cookieParser()); 

// MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
});

// ROUTES (toutes ici)
app.use("/api/products", productRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/notifications", notificationRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("API running");
});

// 404 propre (évite JSON.parse error)
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

module.exports = app;