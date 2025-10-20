const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// 🔹 Obtenir tous les produits
router.get("/", async (req, res) => {
  const produits = await Product.find();
  res.json(produits);
});

// 🔹 Ajouter un nouveau produit
router.post("/", async (req, res) => {
  const { nom, prix, image, stock } = req.body;
  const produit = new Product({ nom, prix, image, stock });
  await produit.save();
  res.status(201).json(produit);
});

module.exports = router;
