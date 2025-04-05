// src/context/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
// Assuming MerchItem is exported from MerchModal. Adjust path if needed.
import { MerchItem } from '../components/MerchModal/MerchModal';

// Define the structure of an item in the cart
// It extends MerchItem and adds cart-specific properties
export interface CartItem extends MerchItem {
  cartItemId: string; // Unique ID for this specific instance in the cart (product + options)
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
  selectedVariant: string | null;
}

// Define the shape of the context value
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MerchItem, quantity: number, options: { size?: string | null; color?: string | null; variant?: string | null }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to parse price string (e.g., "$24.99") to number
const parsePrice = (priceString: string): number => {
    // Remove non-numeric characters except the decimal point
    const numericString = priceString.replace(/[^0-9.]/g, '');
    // Parse the float and handle potential errors (return 0 if NaN)
    const price = parseFloat(numericString);
    return isNaN(price) ? 0 : price;
};

// Create the provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Function to generate a unique ID for cart items based on product and options
  // This ensures items with different sizes/colors are treated distinctly
  const generateCartItemId = (productId: string, options: { size?: string | null; color?: string | null; variant?: string | null }): string => {
    const sizeId = options.size?.replace(/\s+/g, '-') || 'na';
    const colorId = options.color?.replace(/\s+/g, '-') || 'na';
    const variantId = options.variant?.replace(/\s+/g, '-') || 'na';
    return `${productId}-${sizeId}-${colorId}-${variantId}`;
  };

  const addToCart = useCallback((item: MerchItem, quantity: number, options: { size?: string | null; color?: string | null; variant?: string | null }) => {
    setCartItems(prevItems => {
      const cartItemId = generateCartItemId(item.id, options);
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Item with same options already exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        // Ensure quantity doesn't exceed a reasonable limit if needed
        // updatedItems[existingItemIndex].quantity = Math.min(updatedItems[existingItemIndex].quantity, MAX_QUANTITY);
        return updatedItems;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          ...item,
          cartItemId: cartItemId,
          quantity: quantity,
          selectedSize: options.size || null,
          selectedColor: options.color || null,
          selectedVariant: options.variant || null,
        };
        return [...prevItems, newItem];
      }
    });
     console.log("Cart updated:", cartItems); // For debugging
  }, []); // Removed cartItems dependency as it's handled via functional update

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    setCartItems(prevItems => {
       const updated = prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, newQuantity) } : item // Ensure quantity is at least 1
      );
       // If quantity became 0 or less (though prevented by Math.max(1, ...)), remove the item
       // return updated.filter(item => item.quantity > 0); // Or keep the Math.max(1, ...) logic
       return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Memoized calculation for item count
  const getCartItemCount = useCallback((): number => {
    // console.log("Calculating item count:", cartItems); // For debugging
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Memoized calculation for total price
  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((total, item) => {
       const price = parsePrice(item.price); // Use the helper function
       return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount, // Provide the memoized function directly
    getCartTotal,     // Provide the memoized function directly
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartItemCount, getCartTotal]);


  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context, ensures it's used within a provider
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};