require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());
app.get("/", (req, res) => res.send("Backend Aveon connecté à MongoDB ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en marche sur le port ${PORT}`));

const productRoutes = require("./routes/productRoutes");
app.use("/api/produits", productRoutes);
