import { NextResponse } from "next/server";
import { calculateOrder } from "../../../../lib/catalog";
import type { OrderItem, Method } from "../../../../lib/checkout";

type Body = {
  items: OrderItem[];
  name: string;
  email: string;
  phone: string;
  method: Method;
  address?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!secret || !siteUrl) {
    return NextResponse.json({ error: "Payments are not set up yet." }, { status: 500 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const address = body.address?.trim() ?? "";
  const notes = body.notes?.trim() ?? "";
  const method = body.method;

  if (
    !Array.isArray(body.items) ||
    !name ||
    !phone ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    (method !== "pickup" && method !== "delivery") ||
    (method === "delivery" && !address)
  ) {
    return NextResponse.json({ error: "Please check your details." }, { status: 400 });
  }

    const order = await calculateOrder(body.items, method);
  if (order.lines.length === 0) {
    return NextResponse.json(
      { error: "Your cart is empty or the items are unavailable." },
      { status: 400 }
    );
  }

  const reference = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
  const itemsText = order.lines.map((l) => `${l.quantity} × ${l.product.name}`).join(", ");
  const fulfilment = method === "pickup" ? "Pickup at salon" : `Delivery: ${address}`;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(order.total * 100), // Paystack uses kobo
      currency: "NGN",
      reference,
      callback_url: `${siteUrl}/checkout/success`,
      metadata: {
        name,
        phone,
        items: itemsText,
        fulfilment,
        notes,
        custom_fields: [
          { display_name: "Customer", variable_name: "customer", value: name },
          { display_name: "Phone", variable_name: "phone", value: phone },
          { display_name: "Items", variable_name: "items", value: itemsText },
          { display_name: "Fulfilment", variable_name: "fulfilment", value: fulfilment },
          ...(notes ? [{ display_name: "Notes", variable_name: "notes", value: notes }] : []),
        ],
      },
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    return NextResponse.json(
      { error: data.message || "Could not start payment. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: data.data.authorization_url });
}