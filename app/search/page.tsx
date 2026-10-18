import Link from "next/link";
import { Suspense } from "react";
import ProductImage from "../../components/ProductImage";
import { getProducts, getServices } from "../../lib/catalog";
import { formatMoney } from "../../lib/products";
import { formatPrice, formatDuration } from "../../lib/services";

export const metadata = {
  title: "Search",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default function SearchPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Suspense
        fallback={<p className="py-24 text-center text-plum/60">Searching…</p>}
      >
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  if (!query) {
    return (
      <p className="py-24 text-center text-plum/60">
        Tap the search icon above to find services and products.
      </p>
    );
  }

  // Every word typed must appear somewhere in the item
  const words = query.split(/\s+/);
  const matches = (text: string) =>
    words.every((w) => text.toLowerCase().includes(w));

  const products = (await getProducts()).filter((p) =>
    matches(`${p.name} ${p.category} ${p.description}`),
  );
  const services = await getServices();
  const foundServices = services.filter((s) =>
    matches(`${s.name} ${s.category} ${s.description}`),
  );
  const total = products.length + foundServices.length;

  return (
    <>
      <h1 className="font-display text-3xl md:text-4xl">
        Results for “{q.trim()}”
      </h1>
      <p className="mt-2 text-sm text-plum/60">
        {total} {total === 1 ? "result" : "results"}
      </p>

      {total === 0 && (
        <div className="py-16 text-center">
          <p className="text-plum/70">
            Nothing matched your search. Try a different word, or browse:
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="rounded-full bg-rosy px-8 py-3 font-medium text-white transition-colors hover:bg-berry"
            >
              All Services
            </Link>
            <Link
              href="/shop"
              className="rounded-full border-2 border-rosy px-8 py-3 font-medium text-berry transition-colors hover:bg-petal"
            >
              Shop Products
            </Link>
          </div>
        </div>
      )}

      {/* Services */}
      {foundServices.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl">Services</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {foundServices.map((service) => (
              <div
                key={service.id}
                className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-plum/60">{service.category}</p>
                    <h3 className="text-lg font-medium">{service.name}</h3>
                  </div>
                  <p className="shrink-0 font-semibold text-berry">
                    {formatPrice(service)}
                  </p>
                </div>
                <p className="mt-2 flex-1 text-sm text-plum/75">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-petal px-3 py-1 text-xs">
                    ⏱ {formatDuration(service.duration)}
                  </span>
                  <Link
                    href={`/book?service=${service.id}`}
                    className="rounded-full bg-rosy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-berry"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl">Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="group rounded-3xl bg-white p-3 shadow-sm ring-1 ring-petal transition-shadow hover:shadow-md"
              >
                <div className="relative">
                  <ProductImage
                    product={product}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
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
                <p className="mt-1 font-semibold text-berry">
                  {formatMoney(product.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
