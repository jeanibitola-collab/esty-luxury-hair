import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "../../../../lib/admin";
import ServiceForm from "../../../../components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
      <NewService />
    </Suspense>
  );
}

async function NewService() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("services").select("category").order("sort_order");
  const categories = Array.from(new Set((data ?? []).map((r) => r.category)));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin/services" className="text-sm text-plum/70 hover:text-berry">
        ← All services
      </Link>
      <h1 className="mb-6 mt-3 font-display text-3xl">Add Service</h1>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal md:p-8">
        <ServiceForm categories={categories} />
      </div>
    </div>
  );
}