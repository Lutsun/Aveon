const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

// Configuration CORS (reprise de ton server.js)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://aveon.vercel.app",
  "https://aveon-git-main.vercel.app",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      console.log("❌ CORS bloqué pour:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
  exposedHeaders: ["Set-Cookie"]
}));

app.use(express.json());
app.use(cookieParser());

// Connexion MongoDB avec cache
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB error:', error);
  }
};

// Routes (importées depuis api/routes)
app.use('/api/produits', async (req, res, next) => {
  await connectDB();
  const productRoutes = require('./routes/productRoutes');
  return productRoutes(req, res, next);
});

app.use('/api/commandes', async (req, res, next) => {
  await connectDB();
  const commandeRoutes = require('./routes/commandeRoutes');
  return commandeRoutes(req, res, next);
});

app.use('/api/customers', async (req, res, next) => {
  await connectDB();
  const customerRoutes = require('./routes/customerRoutes');
  return customerRoutes(req, res, next);
});

app.use('/api/notifications', async (req, res, next) => {
  await connectDB();
  const notificationsRoutes = require('./routes/notifications');
  return notificationsRoutes(req, res, next);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AVEON API is running!',
    mongodb: isConnected ? 'connected' : 'disconnected'
  });
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Middleware erreur
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message });
});

module.exports = app;