// backend/models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prix: { type: Number, required: true },
  
  // 👈 ANCIEN (garde pour compatibilité existante)
  image: { type: String },
  images: [{ type: String }],
  
  // 👈 NOUVEAU CLOUDINARY
  imageUrl: { type: String },        // URL Cloudinary
  imagePublicId: { type: String },   // ID pour suppression
  
  description: { type: String },
  categorie: { type: String, enum: ["tshirt", "sweat", "accessoire"], default: "tshirt" },
  tailles: [{ type: String }],
  couleurs: [{ type: String }],
  stock: { type: Number, default: 0 },
  tags: [{ type: String }],
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);