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
// ✅ CORS SIMPLE (AUCUNE ERREUR)
// ======================
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://aveon-frontend.vercel.app",
    "https://aveondakar.shop",
    "https://www.aveondakar.shop"
  ],
  credentials: true
}));

app.options("*", cors());


// ======================
app.use(express.json());
app.use(cookieParser());


// ======================
// MONGODB
// ======================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ MongoDB erreur:", err));


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
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});


module.exports = app;