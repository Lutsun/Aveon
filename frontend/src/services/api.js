// services/api.js
// Configuration de l'URL du backend selon l'environnement

const getBackendURL = () => {
  // Production sur Vercel
  if (process.env.NODE_ENV === 'production') {
    // Remplacez par l'URL de VOTRE backend Vercel
    return 'https://aveon-backend.vercel.app/api';
  }
  
  // Développement local
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBackendURL();

console.log('🔧 API Service configuré avec:', API_BASE_URL);

// Service générique pour les appels API
export const apiService = {
  // Récupérer tous les produits
  async getProducts(sort = 'nouveautes') {
    try {
      const response = await fetch(`${API_BASE_URL}/products?sort=${sort}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API getProducts:', error);
      throw error;
    }
  },
  
  // Récupérer un produit par ID
  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API getProductById:', error);
      throw error;
    }
  },
  
  // Créer une commande
  async createCommande(commandeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/commandes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commandeData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API createCommande:', error);
      throw error;
    }
  },
  
  // Vérifier la santé du backend
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Backend indisponible:', error);
      return { status: 'error', message: 'Backend non accessible' };
    }
  }
};

export default apiService;