// backend/routes/commandeRoutes.js
const express = require('express');
const router = express.Router();
const Commande = require('../models/commande');
const Customer = require('../models/customer');
const { generateRememberToken, getCustomerFromCookie } = require('../middleware/auth');

// Créer une nouvelle commande (AVEC gestion customer)
router.post('/', getCustomerFromCookie, async (req, res) => {
  try {
    const { items, customerInfo, paymentMethod, total } = req.body;
    
    // 1. Chercher ou créer le client
    let customer = await Customer.findOne({ 
      email: customerInfo.email.toLowerCase() 
    });
    
    if (!customer) {
      // Nouveau client
      customer = new Customer({
        email: customerInfo.email.toLowerCase(),
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        address: customerInfo.address,
        deliveryInstructions: customerInfo.deliveryInstructions,
        lastCommandeAt: new Date()
      });
      await customer.save();
    } else {
      // Client existant - mise à jour des infos
      customer.firstName = customerInfo.firstName || customer.firstName;
      customer.lastName = customerInfo.lastName || customer.lastName;
      customer.phone = customerInfo.phone || customer.phone;
      if (customerInfo.address) customer.address = customerInfo.address;
      if (customerInfo.deliveryInstructions) customer.deliveryInstructions = customerInfo.deliveryInstructions;
      customer.lastCommandeAt = new Date();
      await customer.save();
    }
    
    // 2. Créer la commande avec customerId
    const commande = new Commande({
      customerId: customer._id,  // LIAISON IMPORTANTE
      items,
      customerInfo,
      paymentMethod,
      total
    });
    
    await commande.save();
    
    // 3. Ajouter la commande à l'historique du client
    customer.commandes.push(commande._id);
    await customer.save();
    
    // 4. Générer le cookie "remember me" (1 an)
    const rememberToken = generateRememberToken(customer._id);
    res.cookie('remember_me', rememberToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000 // 1 an
    });
    
    res.status(201).json({
      success: true,
      commandeId: commande._id,
      customerId: customer._id,
      message: 'Commande créée avec succès'
    });
    
  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Récupérer une commande par ID (avec vérification propriétaire)
router.get('/:id', getCustomerFromCookie, async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('items.productId', 'nom image prix');
    
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    // Vérifier que la commande appartient au client connecté (ou admin)
    if (req.customer && commande.customerId.toString() !== req.customer._id.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
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