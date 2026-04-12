// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Stockage pour les produits
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aveon/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
    format: 'webp',
    quality: 'auto:good'
  }
});

const uploadProduct = multer({ storage: productStorage });

module.exports = {
  cloudinary,
  uploadProduct
};