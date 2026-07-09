"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addCartItem, getCart, removeCartItem, updateCartItem, type Cart } from "@/lib/api";

type CartContextValue = {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch(() => {
        // guest cart simply starts empty if the backend isn't reachable yet
      });
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    setLoading(true);
    try {
      setCart(await addCartItem(productId, quantity));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    setLoading(true);
    try {
      setCart(await updateCartItem(itemId, quantity));
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    setLoading(true);
    try {
      setCart(await removeCartItem(itemId));
    } finally {
      setLoading(false);
    }
  }, []);

  const itemCount = useMemo(
    () => cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cart]
  );

  const value = useMemo(
    () => ({ cart, itemCount, loading, isOpen, open, close, addItem, updateItem, removeItem }),
    [cart, itemCount, loading, isOpen, open, close, addItem, updateItem, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
