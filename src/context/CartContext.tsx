// src/context/CartContext.tsx
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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const generateCustomId = (productId: string, size?: string, color?: string) => {
    return `${productId}-${size || 'nosize'}-${color || 'nocolor'}`;
  };

  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCart(prevCart => {
      const customId = generateCustomId(product._id, size, color);
      const existingItemIndex = prevCart.findIndex(item => item.customId === customId);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          alert(`Désolé, seulement ${product.stock} articles disponibles en stock.`);
          return prevCart;
        }
        
        updatedCart[existingItemIndex].quantity = newQuantity;
        return updatedCart;
      } else {
        if (quantity > product.stock) {
          alert(`Désolé, seulement ${product.stock} articles disponibles en stock.`);
          return prevCart;
        }
        
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
    setCart(prevCart => prevCart.filter(item => item.customId !== customId));
  };

  const updateQuantity = (customId: string, newQuantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.customId === customId) {
          if (newQuantity > item.product.stock) {
            alert(`Désolé, seulement ${item.product.stock} articles disponibles.`);
            return item;
          }
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.prix * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
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
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};