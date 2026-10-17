import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "../../../lib/admin";
import { toggleStock } from "../../../lib/admin-actions";
import { formatMoney } from "../../../lib/products";

type Props = {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
};

export default function AdminProductsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
      <ProductList searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductList({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const { saved, deleted } = await searchParams;

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, price, image_url, emoji, in_stock")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/admin" className="text-sm text-plum/70 hover:text-berry">
        ← Dashboard
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-rosy px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-berry"
        >
          + Add Product
        </Link>
      </div>

      {saved && (
        <p className="mt-4 rounded-2xl bg-petal px-4 py-3 text-sm">✓ Product saved. It’s live in the shop.</p>
      )}
      {deleted && (
        <p className="mt-4 rounded-2xl bg-petal px-4 py-3 text-sm">✓ Product deleted.</p>
      )}
      {error && <p className="mt-4 text-sm text-berry">Couldn’t load products: {error.message}</p>}

      <ul className="mt-6 space-y-3">
        {products?.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-petal"
          >
            {/* Thumbnail */}
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-petal to-pink-soft text-2xl">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.name} fill sizes="64px" className="object-cover" />
              ) : (
                p.emoji
              )}
            </div>

            {/* Info */}
            <Link href={`/admin/products/${p.id}`} className="min-w-0 flex-1">
              <p className="truncate font-medium hover:text-berry">{p.name}</p>
              <p className="text-xs text-plum/60">{p.category}</p>
              <p className="text-sm font-semibold text-berry">{formatMoney(p.price)}</p>
            </Link>

            {/* Quick stock switch */}
            <form action={toggleStock}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="in_stock" value={p.in_stock ? "false" : "true"} />
              <button
                type="submit"
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  p.in_stock ? "bg-petal text-plum" : "bg-plum text-white"
                }`}
              >
                {p.in_stock ? "In stock" : "Sold out"}
              </button>
            </form>

            <Link
              href={`/admin/products/${p.id}`}
              className="hidden rounded-full border border-pink-soft px-4 py-1.5 text-sm transition-colors hover:bg-petal sm:block"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>

      {products?.length === 0 && (
        <p className="py-16 text-center text-plum/60">No products yet. Tap “Add Product” to start.</p>
      )}
    </div>
  );
}