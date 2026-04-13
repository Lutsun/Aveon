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
const allowedOrigins = [
  "http://localhost:5173",
  "https://aveon-frontend.vercel.app",
  "https://aveondakar.shop"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS bloqué pour :", origin);
      callback(new Error("CORS bloqué"));
    }
  },
  credentials: true
}));

app.options("*", cors());

// Middlewares
app.use(express.json());
app.use(cookieParser()); // 🔥 IMPORTANT

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