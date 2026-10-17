import Link from "next/link";
import { Suspense } from "react";
import ProductImage from "../../components/ProductImage";
import { getProducts } from "../../lib/catalog";
import { getCategories, formatMoney } from "../../lib/products";

export const metadata = {
  title: "Shop",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default function ShopPage({ searchParams }: Props) {
  return (
    <>
      {/* Page header */}
      <section className="bg-gradient-to-b from-petal to-blush">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-berry md:text-sm">
            Our favourites
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Shop</h1>
          <p className="mx-auto mt-4 max-w-lg text-plum/80">
            The same products we use and love in the salon.
          </p>
        </div>
      </section>

      <Suspense
        fallback={<p className="py-24 text-center text-plum/60">Loading products…</p>}
      >
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ProductGrid({ searchParams }: Props) {
  const [{ category }, products] = await Promise.all([searchParams, getProducts()]);
  const categories = getCategories(products);
  const active = category && categories.includes(category) ? category : null;
  const list = active ? products.filter((p) => p.category === active) : products;

  const chip = (isActive: boolean) =>
    `shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
      isActive
        ? "border-rosy bg-rosy text-white"
        : "border-pink-soft bg-white hover:bg-petal"
    }`;

  return (
    <>
      {/* Category filter */}
      <nav className="border-b border-petal">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          <Link href="/shop" className={chip(!active)}>
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className={chip(active === c)}
            >
              {c}
            </Link>
          ))}
        </div>
      </nav>

      {list.length === 0 ? (
        <p className="py-24 text-center text-plum/60">No products here yet. Check back soon!</p>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {list.map((product) => (
            <Link
              key={product.slug}
              href={`/shop/${product.slug}`}
              className="group rounded-3xl bg-white p-3 shadow-sm ring-1 ring-petal transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <ProductImage product={product} sizes="(max-width: 768px) 50vw, 25vw" />
                {!product.inStock && (
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs">
                    Sold out
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-plum/60">{product.category}</p>
              <h3 className="mt-0.5 text-sm font-medium leading-snug group-hover:text-berry md:text-base">
                {product.name}
              </h3>
              <p className="mt-1 font-semibold text-berry">{formatMoney(product.price)}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}