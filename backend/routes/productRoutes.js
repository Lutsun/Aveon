const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { cloudinary, uploadProduct } = require("../config/cloudinary");

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

// 🔹 Ajouter un nouveau produit (AVEC UPLOAD CLOUDINARY)
router.post("/", uploadProduct.single("image"), async (req, res) => {
  try {
    let productData = { ...req.body };
    
    // Si une image a été uploadée via Cloudinary
    if (req.file) {
      productData.imageUrl = req.file.path;      // URL Cloudinary
      productData.imagePublicId = req.file.filename; // ID pour suppression
      productData.image = req.file.path;         // Compatibilité avec frontend existant
    }
    
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
    console.error("Erreur création produit:", error);
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Ajouter plusieurs images pour un produit
router.post("/:id/images", uploadProduct.array("images", 5), async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    
    const newImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));
    
    // Mettre à jour l'image principale si c'est la première
    if (!produit.imageUrl && newImages.length > 0) {
      produit.imageUrl = newImages[0].url;
      produit.imagePublicId = newImages[0].publicId;
    }
    
    // Ajouter aux images secondaires (format compatible)
    newImages.forEach(img => {
      if (produit.images) {
        produit.images.push(img.url);
      } else {
        produit.images = [img.url];
      }
    });
    
    await produit.save();
    res.json(produit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Modifier un produit (avec option nouvelle image)
router.put("/:id", uploadProduct.single("image"), async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    
    // Mettre à jour les champs texte
    Object.keys(req.body).forEach(key => {
      if (key !== 'image') {
        produit[key] = req.body[key];
      }
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
    
    // Si nouvelle image uploadée
    if (req.file) {
      // Supprimer l'ancienne image de Cloudinary
      if (produit.imagePublicId) {
        await cloudinary.uploader.destroy(produit.imagePublicId);
      }
      // Remplacer par la nouvelle
      produit.imageUrl = req.file.path;
      produit.imagePublicId = req.file.filename;
      produit.image = req.file.path; // Compatibilité
    }
    
    await produit.save();
    res.json(produit);
  } catch (error) {
    console.error("Erreur modification produit:", error);
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Supprimer un produit (avec suppression image Cloudinary)
router.delete("/:id", async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    
    // Supprimer l'image de Cloudinary si elle existe
    if (produit.imagePublicId) {
      await cloudinary.uploader.destroy(produit.imagePublicId);
      console.log(`🗑️ Image Cloudinary supprimée: ${produit.imagePublicId}`);
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Supprimer uniquement l'image d'un produit (sans supprimer le produit)
router.delete("/:id/image", async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    
    if (produit.imagePublicId) {
      await cloudinary.uploader.destroy(produit.imagePublicId);
      produit.imageUrl = null;
      produit.imagePublicId = null;
      produit.image = null;
      await produit.save();
    }
    
    res.json({ message: "Image supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;