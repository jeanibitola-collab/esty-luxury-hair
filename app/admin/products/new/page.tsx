import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "../../../../lib/admin";
import ProductForm from "../../../../components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
      <NewProduct />
    </Suspense>
  );
}

async function NewProduct() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("category");
  const categories = Array.from(new Set((data ?? []).map((r) => r.category)));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin/products" className="text-sm text-plum/70 hover:text-berry">
        ← All products
      </Link>
      <h1 className="mb-6 mt-3 font-display text-3xl">Add Product</h1>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal md:p-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}