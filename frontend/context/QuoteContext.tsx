import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PublicProductDisplay } from '../utils/productsApi';

export type QuoteItem = {
  product: PublicProductDisplay;
  size?: string;
  freeSample: boolean;
};

type QuoteContextType = {
  items: QuoteItem[];
  addItem: (product: PublicProductDisplay, size?: string, freeSample?: boolean) => void;
  removeItem: (index: number) => void;
  clearItems: () => void;
};

const QuoteContext = createContext<QuoteContextType | null>(null);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<QuoteItem[]>([]);

  const addItem = useCallback((product: PublicProductDisplay, size?: string, freeSample = false) => {
    setItems((prev) => [...prev, { product, size, freeSample }]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearItems = useCallback(() => setItems([]), []);

  return (
    <QuoteContext.Provider value={{ items, addItem, removeItem, clearItems }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider');
  return ctx;
};
