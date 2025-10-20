const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prix: { type: Number, required: true },
  image: { type: String },
  stock: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", productSchema);
