"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "./products";

type CartLine = { product: Product; quantity: number };

type CartContextType = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "cart-v2";
const MAX_QTY = 20;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // Load the saved cart when the site opens
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLines(parsed.filter((l) => l?.product?.slug && l.quantity > 0));
        }
      }
    } catch {
      // ignore broken saved data
    }
    setReady(true);
  }, []);

  // Save the cart whenever it changes
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const addItem = (product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.slug === product.slug);
      if (existing) {
        return prev.map((l) =>
          l.product.slug === product.slug
            ? { product, quantity: Math.min(l.quantity + quantity, MAX_QTY) }
            : l
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, MAX_QTY) }];
    });
  };

  const removeItem = (slug: string) => {
    setLines((prev) => prev.filter((l) => l.product.slug !== slug));
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity < 1) return removeItem(slug);
    setLines((prev) =>
      prev.map((l) =>
        l.product.slug === slug ? { ...l, quantity: Math.min(quantity, MAX_QTY) } : l
      )
    );
  };

  const clearCart = () => setLines([]);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ lines, count, subtotal, ready, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}