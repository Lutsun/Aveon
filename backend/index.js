const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

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
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.options("*", cors());

// Permet d'envoyer les cookies avec les requêtes CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error(err));

// Routes (AVEC /api cette fois)
app.use("/api/products", productRoutes);
app.use("/api/commandes", require("./routes/commandeRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.get("/", (req, res) => {
  res.send("API running");
});

module.exports = app;