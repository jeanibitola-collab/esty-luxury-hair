import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductImage from "../../../components/ProductImage";
import AddToCartButton from "../../../components/AddToCartButton";
import { getProducts, getProduct } from "../../../lib/catalog";
import { formatMoney } from "../../../lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name ?? "Product" };
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-12">
      <Link href="/shop" className="text-sm text-plum/70 hover:text-berry">
        ← Back to shop
      </Link>
      <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
        <ProductDetails params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetails({ params }: Props) {
  const { slug } = await params;
  const [product, products] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-12">
        <ProductImage product={product} sizes="(max-width: 768px) 100vw, 50vw" />

        <div>
          <p className="text-sm text-plum/60">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-berry">
            {formatMoney(product.price)}
          </p>

          <p className="mt-5 text-plum/80">{product.description}</p>

          {product.details.length > 0 && (
            <ul className="mt-5 space-y-2 text-sm">
              {product.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-berry">•</span> {d}
                </li>
              ))}
            </ul>
          )}

          {product.inStock ? (
            <AddToCartButton product={product} />
          ) : (
            <p className="mt-8 w-full rounded-full bg-petal py-3 text-center font-medium text-plum/60 md:w-auto md:px-12">
              Sold out
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl">You may also like</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                className="group rounded-3xl bg-white p-3 shadow-sm ring-1 ring-petal"
              >
                <ProductImage product={p} sizes="(max-width: 768px) 50vw, 25vw" />
                <h3 className="mt-3 text-sm font-medium group-hover:text-berry">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold text-berry">{formatMoney(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}