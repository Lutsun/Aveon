const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// MongoDB (connexion optimisée)
const connectDB = require("./lib/mongodb");

// Routes
const productRoutes = require("./routes/productRoutes");
const commandeRoutes = require("./routes/commandeRoutes");
const customerRoutes = require("./routes/customerRoutes");
const notificationRoutes = require("./routes/notifications");

const app = express();

// ======================
//  CORS SIMPLE ET STABLE
// ======================
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5001",
    "http://localhost:3000",
    "https://aveon-frontend.vercel.app",
    "https://aveondakar.shop",
    "https://www.aveondakar.shop"
  ],
  credentials: true
}));

app.options("*", cors());

// ======================
// MIDDLEWARES
// ======================
app.use(express.json());
app.use(cookieParser());

// ======================
// CONNEXION MONGODB OPTIMISÉE
// ======================
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ Erreur connexion MongoDB:", err);
    res.status(500).json({
      success: false,
      message: "Erreur connexion base de données"
    });
  }
});

// ======================
// ROUTES
// ======================
app.use("/api/products", productRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/notifications", notificationRoutes);

// ======================
app.get("/", (req, res) => {
  res.send("API running");
});

// ======================
// 404 PROPRE
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée"
  });
});

// ======================
// DÉMARRAGE DU SERVEUR
// ======================
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Erreur de connexion MongoDB:", err);
      process.exit(1);
    });
}

module.exports = app;