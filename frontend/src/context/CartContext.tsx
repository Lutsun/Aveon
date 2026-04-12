import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../components/ProductGrid';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  customId: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (customId: string) => void;
  updateQuantity: (customId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  // Fonctions pour la validation des options
  hasItemsWithMissingOptions: () => boolean;
  getItemsWithMissingOptions: () => CartItem[];
  // Toast
  toast: { message: string; type: 'success' | 'error' } | null;
  setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const generateCustomId = (productId: string, size?: string, color?: string) => {
    return `${productId}-${size || 'nosize'}-${color || 'nocolor'}`;
  };

  // Vérifie si un produit a des options requises non sélectionnées
  const hasMissingOptions = (product: Product, size?: string, color?: string): boolean => {
    const needsSize = product.tailles && product.tailles.length > 0;
    const needsColor = product.couleurs && product.couleurs.length > 0;
    
    return (needsSize && !size) || (needsColor && !color);
  };

  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    // Vérifier que toutes les options requises sont sélectionnées
    if (hasMissingOptions(product, size, color)) {
      setToast({
        message: 'Veuillez sélectionner la taille et/ou la couleur avant d\'ajouter au panier',
        type: 'error'
      });
      return;
    }

    setCart(prevCart => {
      const customId = generateCustomId(product._id, size, color);
      const existingItemIndex = prevCart.findIndex(item => item.customId === customId);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          setToast({
            message: `Désolé, seulement ${product.stock} articles disponibles en stock.`,
            type: 'error'
          });
          return prevCart;
        }
        
        updatedCart[existingItemIndex].quantity = newQuantity;
        
        setToast({
          message: `Quantité mise à jour : ${newQuantity} ${product.nom}`,
          type: 'success'
        });
        
        return updatedCart;
      } else {
        if (quantity > product.stock) {
          setToast({
            message: `Désolé, seulement ${product.stock} articles disponibles en stock.`,
            type: 'error'
          });
          return prevCart;
        }
        
        setToast({
          message: `${quantity} ${product.nom} ajouté au panier !`,
          type: 'success'
        });
        
        return [...prevCart, { 
          product, 
          quantity, 
          size, 
          color, 
          customId 
        }];
      }
    });
    
    // Ouvrir le panier quand on ajoute un article
    setIsCartOpen(true);
  };

  const removeFromCart = (customId: string) => {
    const itemToRemove = cart.find(item => item.customId === customId);
    setCart(prevCart => prevCart.filter(item => item.customId !== customId));
    
    if (itemToRemove) {
      setToast({
        message: `${itemToRemove.product.nom} retiré du panier`,
        type: 'success'
      });
    }
  };

  const updateQuantity = (customId: string, newQuantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.customId === customId) {
          if (newQuantity > item.product.stock) {
            setToast({
              message: `Désolé, seulement ${item.product.stock} articles disponibles.`,
              type: 'error'
            });
            return item;
          }
          
          const updatedQuantity = Math.max(1, newQuantity);
          
          if (updatedQuantity !== item.quantity) {
            setToast({
              message: `Quantité mise à jour : ${updatedQuantity} ${item.product.nom}`,
              type: 'success'
            });
          }
          
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    if (cart.length > 0) {
      setCart([]);
      setToast({
        message: 'Panier vidé',
        type: 'success'
      });
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.prix * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Vérifie s'il y a des articles avec des options manquantes
  const hasItemsWithMissingOptions = (): boolean => {
    return cart.some(item => {
      const needsSize = item.product.tailles && item.product.tailles.length > 0;
      const needsColor = item.product.couleurs && item.product.couleurs.length > 0;
      return (needsSize && !item.size) || (needsColor && !item.color);
    });
  };

  // Retourne la liste des articles avec options manquantes
  const getItemsWithMissingOptions = (): CartItem[] => {
    return cart.filter(item => {
      const needsSize = item.product.tailles && item.product.tailles.length > 0;
      const needsColor = item.product.couleurs && item.product.couleurs.length > 0;
      return (needsSize && !item.size) || (needsColor && !item.color);
    });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isCartOpen,
      setIsCartOpen,
      // Fonctions pour la validation des options
      hasItemsWithMissingOptions,
      getItemsWithMissingOptions,
      // Toast
      toast,
      setToast
    }}>
      {children}
    </CartContext.Provider>
  );
};