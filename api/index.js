const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://aveon.vercel.app'], // Ajoute ton domaine
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connexion MongoDB avec cache (important pour serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('📦 Using existing MongoDB connection');
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};

// Import des routes (après connexion DB)
app.use('/api/produits', async (req, res, next) => {
  await connectDB();
  const productRoutes = require('../backend/routes/productRoutes');
  return productRoutes(req, res, next);
});

app.use('/api/commandes', async (req, res, next) => {
  await connectDB();
  const commandeRoutes = require('../backend/routes/commandeRoutes');
  return commandeRoutes(req, res, next);
});

app.use('/api/customers', async (req, res, next) => {
  await connectDB();
  const customerRoutes = require('../backend/routes/customerRoutes');
  return customerRoutes(req, res, next);
});

app.use('/api/notifications', async (req, res, next) => {
  await connectDB();
  const notificationsRoutes = require('../backend/routes/notifications');
  return notificationsRoutes(req, res, next);
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AVEON API is running!' });
});

// Export pour Vercel
module.exports = app;