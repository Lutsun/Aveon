const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔗 Connexion à MongoDB...");
    
    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log("✅ MongoDB connecté!");
    console.log("📍 Hôte:", mongoose.connection.host);
    console.log("📊 Base:", mongoose.connection.db.databaseName);
    
    return mongoose.connection;
    
  } catch (error) {
    console.error("❌ Erreur MongoDB:", error.message);
    throw error; // Important: propager l'erreur
  }
};

module.exports = connectDB;