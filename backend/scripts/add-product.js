// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB pour seeding');

    // Supprimer les anciens produits
    await Product.deleteMany({});
    console.log('🗑️ Anciens produits supprimés');

    // Insérer des produits 
    const products = [
      {
        nom: "T-Shirt Aveon Classic",
        prix: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w-400",
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
        ],
        description: "T-shirt basique en coton de haute qualité",
        categorie: "tshirt",
        tailles: ["S", "M", "L", "XL"],
        couleurs: ["Noir", "Blanc", "Bleu"],
        stock: 50,
        tags: ["nouveau", "bestseller", "cotton"]
      },
      {
        nom: "Sweat Aveon Hoodie",
        prix: 59.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"
        ],
        description: "Sweat à capuche confortable pour l'hiver",
        categorie: "sweat",
        tailles: ["M", "L", "XL"],
        couleurs: ["Gris", "Noir"],
        stock: 30,
        tags: ["hiver", "confort", "limited"]
      },
      {
        nom: "Casquette Aveon",
        prix: 24.99,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800"
        ],
        description: "Casquette ajustable avec logo Aveon",
        categorie: "accessoire",
        tailles: ["One Size"],
        couleurs: ["Noir", "Blanc"],
        stock: 100,
        tags: ["accessoire", "été", "nouveau"]
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} produits insérés`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedProducts();