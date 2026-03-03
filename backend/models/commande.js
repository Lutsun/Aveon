// backend/models/Commande.js
const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: String,
    color: String,
    price: { type: Number, required: true }
  }],
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    }
  },
  paymentInfo: {
    cardNumber: String, // Seulement les 4 derniers chiffres
    cardName: String
  },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['en_attente', 'confirmée', 'expédiée', 'livrée', 'annulée'],
    default: 'en_attente'
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commande', commandeSchema);