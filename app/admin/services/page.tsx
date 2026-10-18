import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "../../../lib/admin";
import { toggleService } from "../../../lib/admin-actions";
import { formatDuration, formatPrice } from "../../../lib/services";

type Props = {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
};

export default function AdminServicesPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
      <ServiceList searchParams={searchParams} />
    </Suspense>
  );
}

async function ServiceList({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const { saved, deleted } = await searchParams;

  const { data, error } = await supabase
    .from("services")
    .select("id, name, category, duration, price, price_from, active")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const services = data ?? [];
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/admin" className="text-sm text-plum/70 hover:text-berry">
        ← Dashboard
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Services</h1>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-rosy px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-berry"
        >
          + Add Service
        </Link>
      </div>

      {saved && (
        <p className="mt-4 rounded-2xl bg-petal px-4 py-3 text-sm">✓ Service saved. It’s live on the website.</p>
      )}
      {deleted && <p className="mt-4 rounded-2xl bg-petal px-4 py-3 text-sm">✓ Service deleted.</p>}
      {error && <p className="mt-4 text-sm text-berry">Couldn’t load services: {error.message}</p>}

      {categories.map((category) => (
        <section key={category} className="mt-8">
          <h2 className="mb-3 font-display text-xl">{category}</h2>
          <ul className="space-y-3">
            {services
              .filter((s) => s.category === category)
              .map((s) => (
                <li
                  key={s.id}
                  className={`flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-petal ${
                    s.active ? "" : "opacity-60"
                  }`}
                >
                  <Link href={`/admin/services/${s.id}`} className="min-w-0 flex-1">
                    <p className="truncate font-medium hover:text-berry">{s.name}</p>
                    <p className="text-sm">
                      <span className="font-semibold text-berry">
                        {formatPrice({ price: s.price, priceFrom: s.price_from })}
                      </span>
                      <span className="text-plum/60"> · {formatDuration(s.duration)}</span>
                    </p>
                  </Link>

                  {/* Quick show/hide switch */}
                  <form action={toggleService}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="active" value={s.active ? "false" : "true"} />
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        s.active ? "bg-petal text-plum" : "bg-plum text-white"
                      }`}
                    >
                      {s.active ? "Showing" : "Hidden"}
                    </button>
                  </form>

                  <Link
                    href={`/admin/services/${s.id}`}
                    className="hidden rounded-full border border-pink-soft px-4 py-1.5 text-sm transition-colors hover:bg-petal sm:block"
                  >
                    Edit
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}

      {services.length === 0 && !error && (
        <p className="py-16 text-center text-plum/60">No services yet. Tap “Add Service” to start.</p>
      )}
    </div>
  );
}