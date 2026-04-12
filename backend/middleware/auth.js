const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

const JWT_SECRET = process.env.JWT_SECRET || 'aveon_secret_key_2026_change_this';

// Générer un token pour "se souvenir du client"
const generateRememberToken = (customerId) => {
  return jwt.sign({ customerId }, JWT_SECRET, { expiresIn: '365d' });
};

// Middleware pour récupérer le client depuis le cookie
const getCustomerFromCookie = async (req, res, next) => {
  const token = req.cookies.remember_me;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const customer = await Customer.findById(decoded.customerId);
      if (customer) {
        req.customer = customer;
      }
    } catch (error) {
      console.log('Token invalide:', error.message);
    }
  }
  
  next();
};

module.exports = {
  generateRememberToken,
  getCustomerFromCookie
};