
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product, User, Address } from '../types';
import { MOCK_USER } from '../constants';

interface AppContextType {
  user: User | null;
  login: (firstName: string, lastName: string, email: string) => void;
  updateUser: (data: Partial<User>) => void;
  addAddress: (addr: Omit<Address, 'address_id'>) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (item: Product) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const login = (firstName: string, lastName: string, email: string) => {
    // Merge provided data with mock user structure
    setUser({ 
        ...MOCK_USER, 
        first_name: firstName, 
        last_name: lastName, 
        email: email 
    });
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const addAddress = (addr: Omit<Address, 'address_id'>) => {
    if (!user) return;
    const newAddress: Address = {
        ...addr,
        address_id: Date.now(), // Mock ID
        user_id: user.user_id
    };
    const updatedAddresses = [...user.addresses, newAddress];
    updateUser({ addresses: updatedAddresses });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (item: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product_id === item.product_id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((i) => i.product_id !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.product_id === itemId) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => setCart([]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        updateUser,
        addAddress,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
