import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "../../lib/admin";
import SignOutButton from "../../components/admin/SignOutButton";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const { user } = await requireAdmin();

  const cards = [
    {
      href: "/admin/products",
      icon: "🛍️",
      title: "Products",
      text: "Add new products, change prices and photos, mark items sold out.",
    },
    {
      href: "/shop",
      icon: "👀",
      title: "View Shop",
      text: "See the shop the way customers see it.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-plum/60">Signed in as {user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-petal transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-petal text-2xl">
              {card.icon}
            </div>
            <h2 className="mt-4 font-display text-xl">{card.title}</h2>
            <p className="mt-1 text-sm text-plum/70">{card.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}