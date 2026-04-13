// Configuration de l'API
const getApiUrl = () => {
  // En production (sur Vercel)
  if (import.meta.env.PROD) {
    // Remplacez par l'URL DE VOTRE BACKEND sur Vercel
    return '/api';
  }
  
  // En développement local
  return 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();
console.log(`🔧 API configurée: ${API_URL} (${import.meta.env.MODE})`);