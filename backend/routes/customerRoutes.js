const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const { getCustomerFromCookie } = require('../middleware/auth');

// Récupérer le client connecté (via cookie)
router.get('/me', getCustomerFromCookie, async (req, res) => {
  if (req.customer) {
    res.json({
      success: true,
      customer: {
        email: req.customer.email,
        firstName: req.customer.firstName,
        lastName: req.customer.lastName,
        phone: req.customer.phone,
        address: req.customer.address,
        deliveryInstructions: req.customer.deliveryInstructions
      }
    });
  } else {
    res.json({ success: false, customer: null });
  }
});

// Créer ou mettre à jour un client
router.post('/upsert', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, address, deliveryInstructions } = req.body;
    
    let customer = await Customer.findOne({ email: email.toLowerCase() });
    
    if (customer) {
      // Mise à jour client existant
      customer.firstName = firstName || customer.firstName;
      customer.lastName = lastName || customer.lastName;
      customer.phone = phone || customer.phone;
      if (address) customer.address = address;
      if (deliveryInstructions) customer.deliveryInstructions = deliveryInstructions;
      await customer.save();
    } else {
      // Création nouveau client
      customer = new Customer({
        email: email.toLowerCase(),
        firstName,
        lastName,
        phone,
        address,
        deliveryInstructions
      });
      await customer.save();
    }
    
    res.json({
      success: true,
      customerId: customer._id
    });
  } catch (error) {
    console.error('Erreur upsert customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Récupérer les commandes du client connecté
router.get('/my-commandes', getCustomerFromCookie, async (req, res) => {
  try {
    if (!req.customer) {
      return res.json({ success: true, commandes: [] });
    }
    
    const Commande = require('../models/commande');
    const commandes = await Commande.find({ customerId: req.customer._id })
      .sort({ date: -1 })
      .populate('items.productId', 'nom image prix');
    
    res.json({
      success: true,
      commandes
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;