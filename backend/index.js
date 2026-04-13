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
      callback(new Error("CORS bloqué pour : " + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error(err));

// Routes (AVEC /api cette fois)
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

module.exports = app;