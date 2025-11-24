const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prix: { type: Number, required: true },
  image: { type: String },
  images: [{ type: String }], // Plusieurs images
  description: { type: String },
  categorie: { type: String, enum: ["tshirt", "sweat", "accessoire"], default: "tshirt" },
  tailles: [{ type: String }], // ["S", "M", "L", "XL"]
  couleurs: [{ type: String }], // ["Noir", "Blanc", "Bleu"]
  stock: { type: Number, default: 0 },
  tags: [{ type: String }], // ["nouveau", "tendance", "limité"]
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);