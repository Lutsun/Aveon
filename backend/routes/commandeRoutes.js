// backend/routes/commandeRoutes.js
const express = require('express');
const router = express.Router();
const Commande = require('../models/commande');

// Créer une nouvelle commande
router.post('/', async (req, res) => {
  try {
    const commande = new Commande(req.body);
    await commande.save();
    
    // Ici vous pourriez envoyer un email de confirmation
    // sendConfirmationEmail(commande);
    
    res.status(201).json(commande);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Récupérer une commande par ID
router.get('/:id', async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('items.productId', 'nom image prix');
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer toutes les commandes (pour l'admin)
router.get('/', async (req, res) => {
  try {
    const commandes = await Commande.find().sort({ date: -1 });
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