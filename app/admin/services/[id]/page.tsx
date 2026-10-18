import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/admin";
import { deleteService } from "../../../../lib/admin-actions";
import ServiceForm from "../../../../components/admin/ServiceForm";
import ConfirmButton from "../../../../components/admin/ConfirmButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditServicePage({ params }: Props) {
  return (
    <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
      <EditService params={params} />
    </Suspense>
  );
}

async function EditService({ params }: Props) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  const [{ data: service }, { data: rows }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, category, description, duration, price, price_from, active")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("services").select("category").order("sort_order"),
  ]);

  if (!service) notFound();
  const categories = Array.from(new Set((rows ?? []).map((r) => r.category)));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin/services" className="text-sm text-plum/70 hover:text-berry">
        ← All services
      </Link>
      <h1 className="mb-6 mt-3 font-display text-3xl">Edit Service</h1>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal md:p-8">
        <ServiceForm service={service} categories={categories} />
      </div>

      <form action={deleteService} className="mt-8 text-center">
        <input type="hidden" name="id" value={service.id} />
        <ConfirmButton
          type="submit"
          message={`Delete "${service.name}"? This can’t be undone.`}
          className="text-sm text-berry underline hover:text-plum"
        >
          Delete this service
        </ConfirmButton>
      </form>
    </div>
  );
}