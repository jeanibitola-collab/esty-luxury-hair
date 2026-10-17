import Link from "next/link";
import { Suspense } from "react";
import ClearCart from "../../../components/ClearCart";
import { formatMoney } from "../../../lib/products";
import { site } from "../../../lib/site";

export const metadata = {
  title: "Payment",
};

type Props = {
  searchParams: Promise<{ reference?: string }>;
};

export default function SuccessPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Suspense
        fallback={<p className="text-center text-plum/70">Checking your payment…</p>}
      >
        <PaymentResult searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Ask Paystack whether this payment really succeeded
async function verifyPayment(reference: string) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.status && data.data?.status === "success" ? data.data : null;
}

async function PaymentResult({ searchParams }: Props) {
  const { reference } = await searchParams;
  const payment = reference ? await verifyPayment(reference) : null;

  if (!payment) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-petal">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-petal text-3xl">
          😕
        </div>
        <h1 className="mt-4 font-display text-2xl">Payment not completed</h1>
        <p className="mt-2 text-plum/75">
          We couldn’t confirm your payment. You haven’t been charged, and your cart is
          still saved.
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-block rounded-full bg-rosy px-8 py-3 font-medium text-white transition-colors hover:bg-berry"
        >
          Try Again
        </Link>
      </div>
    );
  }

  const meta = payment.metadata ?? {};
  const whatsappText = [
    `Hi ${site.name}! I just paid for my order ✅`,
    `Reference: ${payment.reference}`,
    `Name: ${meta.name}`,
    `Items: ${meta.items}`,
    `${meta.fulfilment}`,
  ].join("\n");

  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-petal">
      <ClearCart />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-petal text-3xl">
        🎉
      </div>
      <h1 className="mt-4 font-display text-2xl">Thank you for your order!</h1>
      <p className="mt-2 text-plum/75">
        Your payment of <strong>{formatMoney(payment.amount / 100)}</strong> was successful.
        A receipt has been sent to your email.
      </p>

      <dl className="mt-6 space-y-2 rounded-2xl bg-blush p-4 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-plum/60">Reference</dt>
          <dd className="text-right font-medium">{payment.reference}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-plum/60">Items</dt>
          <dd className="text-right">{meta.items}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-plum/60">Getting it</dt>
          <dd className="text-right">{meta.fulfilment}</dd>
        </div>
      </dl>

      <a
        href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(whatsappText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block rounded-full border-2 border-rosy py-3 text-sm font-medium text-berry transition-colors hover:bg-petal"
      >
        Message us on WhatsApp
      </a>
      <Link
        href="/shop"
        className="mt-3 block rounded-full bg-rosy py-3 font-medium text-white transition-colors hover:bg-berry"
      >
        Continue Shopping
      </Link>
    </div>
  );
}