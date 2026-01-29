const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// 🔹 Obtenir tous les produits
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Tentative de récupération des produits...");
    const produits = await Product.find().sort({ dateCreation: -1 });
    console.log(`✅ ${produits.length} produits trouvés`);
    res.json(produits);
  } catch (error) {
    console.error("❌ Erreur dans GET /api/produits:", error);
    res.status(500).json({ 
      message: error.message,
      stack: error.stack 
    });
  }
});

// 🔹 Obtenir un produit par ID
router.get("/:id", async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Ajouter un nouveau produit
router.post("/", async (req, res) => {
  try {
    const produit = new Product(req.body);
    await produit.save();
    res.status(201).json(produit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Modifier un produit
router.put("/:id", async (req, res) => {
  try {
    const produit = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json(produit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Supprimer un produit
router.delete("/:id", async (req, res) => {
  try {
    const produit = await Product.findByIdAndDelete(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;