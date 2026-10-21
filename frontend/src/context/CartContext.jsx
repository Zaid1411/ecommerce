import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('woodwright_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to parse cart from storage', err);
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('woodwright_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to storage', err);
    }
  }, [cartItems]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1, selectedFinish = null) => {
    const finish = selectedFinish || product.timberFinish || 'Standard Finish';
    const itemKey = `${product.id || product._id}-${finish}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartKey === itemKey);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = product.countInStock || 20;

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, maxStock),
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartKey: itemKey,
            product: product.id || product._id,
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images[0]),
            countInStock: product.countInStock,
            selectedFinish: finish,
            quantity,
          },
        ];
      }
    });

    showNotification(`Added "${product.name}" (${finish}) to your bespoke selection.`);
    setIsDrawerOpen(true);
  };

  const updateQuantity = (cartKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartKey);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey
          ? { ...item, quantity: Math.min(newQuantity, item.countInStock || 99) }
          : item
      )
    );
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('woodwright_cart');
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = subtotalPrice > 3000 || subtotalPrice === 0 ? 0 : 150;
  const taxPrice = Math.round(subtotalPrice * 0.15); // 15% GST
  const totalPrice = subtotalPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        setIsDrawerOpen,
        openCart: () => setIsDrawerOpen(true),
        closeCart: () => setIsDrawerOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotalPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
