"use client";

import { useEffect, useRef } from "react";
import { useCart } from "../lib/cart";

export default function ClearCart() {
  const { ready, clearCart } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (ready && !done.current) {
      done.current = true;
      clearCart();
    }
  }, [ready, clearCart]);

  return null;
}