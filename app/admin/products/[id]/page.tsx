import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/admin";
import ProductForm from "../../../../components/admin/ProductForm";
import DeleteProductButton from "../../../../components/admin/DeleteProductButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: Props) {
  return (
    <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: Props) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  const [{ data: product }, { data: rows }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, category, price, description, details, emoji, image_url, in_stock")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("products").select("category"),
  ]);

  if (!product) notFound();
  const categories = Array.from(new Set((rows ?? []).map((r) => r.category)));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin/products" className="text-sm text-plum/70 hover:text-berry">
        ← All products
      </Link>
      <h1 className="mb-6 mt-3 font-display text-3xl">Edit Product</h1>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal md:p-8">
        <ProductForm product={product} categories={categories} />
      </div>
      <div className="mt-8 text-center">
        <DeleteProductButton id={product.id} name={product.name} imageUrl={product.image_url} />
      </div>
    </div>
  );
}