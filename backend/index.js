const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://aveon.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB erreur:', err.message));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend fonctionne',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes - chargement direct (pas dynamique)
app.use('/api/produits', require('./routes/productRoutes'));
app.use('/api/commandes', require('./routes/commandeRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/notifications', require('./routes/notifications'));

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} non trouvée` });
});

// Middleware d'erreur
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ error: 'Erreur serveur', details: err.message });
});

module.exports = app;