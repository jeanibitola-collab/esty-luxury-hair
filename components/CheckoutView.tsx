"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../lib/cart";
import { formatMoney } from "../lib/products";
import type { DeliveryZone, Method } from "../lib/checkout";
import { site } from "../lib/site";

const inputClass =
  "w-full rounded-2xl border border-pink-soft bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rosy";

export default function CheckoutView({ zones }: { zones: DeliveryZone[] }) {
  const { lines, subtotal, count, ready, clearCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<Method>("pickup");
  const [zoneId, setZoneId] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [orderLink, setOrderLink] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState("");

  if (!ready) return <div className="py-24" />;

  // After a WhatsApp order is sent
  if (orderLink) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-petal">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-petal text-3xl">
          🛍️
        </div>
        <h2 className="mt-4 font-display text-2xl">Order ready to send!</h2>
        <p className="mt-2 text-plum/75">
          Your order <strong>{orderRef}</strong> is waiting in WhatsApp. Tap{" "}
          <strong>send</strong>, and we’ll reply with payment details.
        </p>
        <a
          href={orderLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm text-berry underline"
        >
          WhatsApp didn’t open? Tap here
        </a>
        <div>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-rosy px-8 py-3 font-medium text-white transition-colors hover:bg-berry"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-display text-2xl">Your cart is empty</h2>
        <p className="mt-2 text-plum/70">
          Add some products before checking out.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-rosy px-8 py-3 font-medium text-white transition-colors hover:bg-berry"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  const zone = zones.find((z) => z.id === zoneId);
  const delivery = method === "delivery" ? (zone?.fee ?? 0) : 0;
  const total = subtotal + delivery;

  const validate = (online: boolean) => {
    if (!name.trim() || !phone.trim())
      return "Please enter your name and phone number.";
    if (online && !/^\S+@\S+\.\S+$/.test(email.trim()))
      return "Please enter a valid email address for your receipt.";
    if (method === "delivery") {
      if (online && !zone) return "Please choose your delivery area.";
      if (!address.trim()) return "Please enter your delivery address.";
    }
    return "";
  };

  // Pay online with Paystack
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate(true);
    if (problem) return setError(problem);
    setError("");
    setPaying(true);

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            slug: l.product.slug,
            quantity: l.quantity,
          })),
          name,
          email,
          phone,
          method,
          zoneId,
          address,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment.");
      window.location.href = data.url; // go to Paystack
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setPaying(false);
    }
  };

  // Order on WhatsApp instead (works even if the area isn't listed)
  const handleWhatsApp = () => {
    const problem = validate(false);
    if (problem) return setError(problem);
    setError("");

    const ref = `ORD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const deliveryLine =
      method === "pickup"
        ? "Pickup at the salon"
        : zone
          ? `Delivery to ${zone.name} (${formatMoney(zone.fee)}): ${address.trim()}`
          : `Delivery to: ${address.trim()} (please quote delivery fee)`;

    const message = [
      `Hi ${site.name}! I'd like to place an order 🛍️`,
      `Order: ${ref}`,
      "",
      ...lines.map(
        ({ product, quantity }) =>
          `• ${quantity} × ${product.name} – ${formatMoney(product.price * quantity)}`,
      ),
      "",
      `Subtotal: ${formatMoney(subtotal)}`,
      deliveryLine,
      method === "delivery" && !zone ? "" : `Total: ${formatMoney(total)}`,
      "",
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      notes.trim() ? `Notes: ${notes.trim()}` : "",
    ]
      .join("\n")
      .trim();

    const link = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
    setOrderRef(ref);
    setOrderLink(link);
    clearCart();
  };

  const methodOption = (value: Method, title: string, text: string) => (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
        method === value ? "border-rosy bg-petal" : "border-pink-soft bg-white"
      }`}
    >
      <input
        type="radio"
        name="method"
        value={value}
        checked={method === value}
        onChange={() => setMethod(value)}
        className="mt-1 accent-rosy"
      />
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-plum/70">{text}</span>
      </span>
    </label>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleWhatsApp();
      }}
      className="grid gap-8 md:grid-cols-3"
    >
      {/* Details */}
      <div className="space-y-8 md:col-span-2">
        <section>
          <h2 className="mb-3 font-display text-xl">Your details</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={inputClass}
            />

            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className={inputClass}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl">
            How would you like to get it?
          </h2>
          <div className="space-y-3">
            {methodOption(
              "pickup",
              "Pickup at the salon",
              "Free. We’ll let you know when it’s ready.",
            )}
            {methodOption("delivery", "Delivery", "Fee depends on your area.")}
          </div>

          {method === "delivery" && (
            <div className="mt-3 space-y-3">
              {zones.length > 0 ? (
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Choose your area…</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} – {formatMoney(z.fee)}
                    </option>
                  ))}
                </select>
              ) : null}
              <textarea
                placeholder="Full delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
                rows={3}
                className={inputClass}
              />
              <p className="text-xs text-plum/60">
                Can’t find your area? Just enter your address and we’ll quote
                your delivery fee on WhatsApp.
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl">Notes (optional)</h2>
          <textarea
            placeholder="Colour choice, delivery instructions, anything else…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </section>
      </div>

      {/* Summary */}
      <div className="h-fit rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal md:sticky md:top-24">
        <h2 className="font-display text-xl">Order Summary</h2>
        <ul className="mt-4 space-y-3">
          {lines.map(({ product, quantity }) => (
            <li
              key={product.slug}
              className="flex justify-between gap-3 text-sm"
            >
              <span>
                {product.name}{" "}
                <span className="text-plum/60">× {quantity}</span>
              </span>
              <span className="shrink-0">
                {formatMoney(product.price * quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-petal pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-plum/60">Subtotal ({count})</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-plum/60">Delivery</span>
            <span className="text-right">
              {method === "pickup"
                ? "Free"
                : zone
                  ? formatMoney(zone.fee)
                  : "Choose your area"}
            </span>
          </div>
        </div>
        <div className="mt-3 flex justify-between border-t border-petal pt-3 font-semibold">
          <span>Total</span>
          <span className="text-berry">{formatMoney(total)}</span>
        </div>

        {error && <p className="mt-4 text-sm text-berry">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-rosy py-3 font-medium text-white shadow-sm transition-colors hover:bg-berry"
        >
          Send Order on WhatsApp
        </button>
        <p className="mt-2 text-center text-xs text-plum/60">
          We’ll reply with payment details to confirm your order.
        </p>

        <Link
          href="/cart"
          className="mt-4 block text-center text-sm text-plum/70 hover:text-berry"
        >
          ← Back to cart
        </Link>
      </div>
    </form>
  );
}
