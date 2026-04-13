const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Routes
const productRoutes = require("./routes/productRoutes");
const commandeRoutes = require("./routes/commandeRoutes");
const customerRoutes = require("./routes/customerRoutes");
const notificationRoutes = require("./routes/notifications");

const app = express();


// ======================
// 🔥 CORS CONFIG (FINAL)
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://aveon-frontend.vercel.app",
  "https://aveondakar.shop",
  "https://www.aveondakar.shop"
];

const corsOptions = {
  origin: function (origin, callback) {
    // autorise Postman / requêtes serveur sans origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS bloqué pour :", origin);
      callback(null, false); // ⚠️ on bloque sans crash
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// 🔥 IMPORTANT : appliquer partout
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 🔥 SÉCURITÉ : forcer headers sur toutes réponses
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
});


// ======================
// 🔧 MIDDLEWARES
// ======================
app.use(express.json());
app.use(cookieParser());


// ======================
// 🍃 MONGODB
// ======================
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ MongoDB erreur:", err));


// ======================
// 📦 ROUTES API
// ======================
app.use("/api/products", productRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/notifications", notificationRoutes);


// ======================
// 🏠 ROOT
// ======================
app.get("/", (req, res) => {
  res.send("API running");
});


// ======================
// ❌ 404 HANDLER (IMPORTANT)
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée"
  });
});


// ======================
module.exports = app;