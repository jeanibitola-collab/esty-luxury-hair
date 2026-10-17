"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import { useCart } from "../lib/cart";
import { formatMoney } from "../lib/products";

export default function CartView() {
  const { lines, subtotal, count, ready, updateQuantity, removeItem } = useCart();

  // Wait for the saved cart to load (avoids a flash of "empty cart")
  if (!ready) return <div className="py-24" />;

  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-petal text-4xl">
          🛍️
        </div>
        <h2 className="mt-5 font-display text-2xl">Your cart is empty</h2>
        <p className="mt-2 text-plum/70">Find something you’ll love in our shop.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-rosy px-8 py-3 font-medium text-white transition-colors hover:bg-berry"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Items */}
      <ul className="space-y-4 md:col-span-2">
        {lines.map(({ product, quantity }) => (
          <li
            key={product.slug}
            className="flex gap-4 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-petal"
          >
            <Link href={`/shop/${product.slug}`} className="w-20 shrink-0 md:w-24">
              <ProductImage product={product} sizes="96px" />
            </Link>

            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-2">
                <Link
                  href={`/shop/${product.slug}`}
                  className="text-sm font-medium leading-snug hover:text-berry md:text-base"
                >
                  {product.name}
                </Link>
                <p className="shrink-0 text-sm font-semibold text-berry md:text-base">
                  {formatMoney(product.price * quantity)}
                </p>
              </div>
              <p className="text-xs text-plum/60">{formatMoney(product.price)} each</p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-full border border-pink-soft">
                  <button
                    onClick={() => updateQuantity(product.slug, quantity - 1)}
                    aria-label="Decrease quantity"
                    className="h-9 w-9 rounded-full hover:bg-petal"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.slug, quantity + 1)}
                    aria-label="Increase quantity"
                    className="h-9 w-9 rounded-full hover:bg-petal"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(product.slug)}
                  className="text-xs text-plum/60 underline hover:text-berry"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="h-fit rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal md:sticky md:top-24">
        <h2 className="font-display text-xl">Order Summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span>Items ({count})</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-plum/60">
          <span>Delivery</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-petal pt-4 font-semibold">
          <span>Subtotal</span>
          <span className="text-berry">{formatMoney(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-5 block rounded-full bg-rosy py-3 text-center font-medium text-white shadow-sm transition-colors hover:bg-berry"
        >
          Checkout
        </Link>
        <Link
          href="/shop"
          className="mt-3 block text-center text-sm text-plum/70 hover:text-berry"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}