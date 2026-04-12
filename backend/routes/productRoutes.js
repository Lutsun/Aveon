const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// 🔹 Obtenir tous les produits
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Récupération des produits...");
    const produits = await Product.find().sort({ dateCreation: -1 });
    console.log(`✅ ${produits.length} produits trouvés`);
    res.json(produits);
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({ message: error.message });
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

// 🔹 Créer un produit (sans Cloudinary)
router.post("/", async (req, res) => {
  try {
    let productData = { ...req.body };
    
    // Gérer les tableaux (si envoyés en JSON string)
    if (productData.tailles && typeof productData.tailles === 'string') {
      productData.tailles = JSON.parse(productData.tailles);
    }
    if (productData.couleurs && typeof productData.couleurs === 'string') {
      productData.couleurs = JSON.parse(productData.couleurs);
    }
    if (productData.tags && typeof productData.tags === 'string') {
      productData.tags = JSON.parse(productData.tags);
    }
    
    const produit = new Product(productData);
    await produit.save();
    res.status(201).json(produit);
  } catch (error) {
    console.error("Erreur création:", error);
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Modifier un produit
router.put("/:id", async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    
    // Mettre à jour les champs
    Object.keys(req.body).forEach(key => {
      produit[key] = req.body[key];
    });
    
    // Gérer les tableaux JSON
    if (req.body.tailles && typeof req.body.tailles === 'string') {
      produit.tailles = JSON.parse(req.body.tailles);
    }
    if (req.body.couleurs && typeof req.body.couleurs === 'string') {
      produit.couleurs = JSON.parse(req.body.couleurs);
    }
    if (req.body.tags && typeof req.body.tags === 'string') {
      produit.tags = JSON.parse(req.body.tags);
    }
    
    await produit.save();
    res.json(produit);
  } catch (error) {
    console.error("Erreur modification:", error);
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
    console.error("Erreur suppression:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;