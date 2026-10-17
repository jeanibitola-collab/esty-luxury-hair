"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../lib/cart";
import type { Product } from "../lib/products";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        {/* Quantity picker */}
        <div className="flex items-center rounded-full border border-pink-soft bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="h-11 w-11 rounded-full text-lg hover:bg-petal"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            aria-label="Increase quantity"
            className="h-11 w-11 rounded-full text-lg hover:bg-petal"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 rounded-full bg-rosy py-3 font-medium text-white shadow-sm transition-colors hover:bg-berry md:flex-none md:px-12"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>

      {added && (
        <Link href="/cart" className="mt-3 inline-block text-sm text-berry underline">
          View cart →
        </Link>
      )}
    </div>
  );
}