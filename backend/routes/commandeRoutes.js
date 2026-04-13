// backend/routes/commandeRoutes.js
const express = require('express');
const router = express.Router();
const Commande = require('../models/commande');
const Customer = require('../models/customer');
const { generateRememberToken, getCustomerFromCookie } = require('../middleware/auth');

// Créer une nouvelle commande (AVEC gestion customer)
router.post("/", async (req, res) => {
  try {
    const { customerInfo } = req.body;

    // 🔥 Création de la commande
    const commande = await Commande.create(req.body);

    // 🔥 COOKIE (client reconnu)
    const token = JSON.stringify({
      email: customerInfo.email,
      name: customerInfo.name
    });

    res.cookie("remember_me", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    // 🔥 RÉPONSE PROPRE (TRÈS IMPORTANT)
    res.status(201).json({
      success: true,
      commandeId: commande._id,   
      commande
    });

  } catch (err) {
    console.error("❌ Erreur création commande:", err);
    res.status(500).json({
      success: false,
      message: "Erreur création commande"
    });
  }
});

// Récupérer une commande par ID (avec vérification propriétaire)
router.get("/:id", async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée"
      });
    }

    res.json(commande);

  } catch (err) {
    console.error("❌ Erreur récupération commande:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});

// Récupérer toutes les commandes (admin seulement - à sécuriser plus tard)
router.get('/', async (req, res) => {
  try {
    const commandes = await Commande.find()
      .sort({ date: -1 })
      .populate('customerId', 'firstName lastName email');
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour le statut d'une commande
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(commande);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;