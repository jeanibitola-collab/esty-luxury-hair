import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "../../../lib/admin";
import { saveZone, deleteZone } from "../../../lib/admin-actions";
import { currency } from "../../../lib/services";
import ConfirmButton from "../../../components/admin/ConfirmButton";

const inputClass =
  "w-full rounded-2xl border border-pink-soft bg-white px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-rosy";

export default function DeliveryPage() {
  return (
    <Suspense fallback={<p className="py-24 text-center text-plum/60">Loading…</p>}>
      <DeliveryZones />
    </Suspense>
  );
}

async function DeliveryZones() {
  const { supabase } = await requireAdmin();

  const { data: zones, error } = await supabase
    .from("delivery_zones")
    .select("id, name, fee, active")
    .order("fee", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm text-plum/70 hover:text-berry">
        ← Dashboard
      </Link>
      <h1 className="mt-3 font-display text-3xl">Delivery Areas</h1>
      <p className="mt-1 text-sm text-plum/60">
        Customers choose their area at checkout, and the fee is added to their total.
      </p>

      {error && <p className="mt-4 text-sm text-berry">Couldn’t load areas: {error.message}</p>}

      {/* Add new area */}
      <form
        action={saveZone}
        className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal"
      >
        <h2 className="font-display text-xl">Add an area</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_10rem_auto]">
          <input
            name="name"
            placeholder="Area name, e.g. Wuse & Maitama"
            required
            className={inputClass}
          />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-plum/60">
              {currency}
            </span>
            <input
              name="fee"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              placeholder="Fee"
              required
              className={`${inputClass} pl-9`}
            />
          </div>
          <input type="hidden" name="active" value="on" />
          <button
            type="submit"
            className="rounded-full bg-rosy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-berry"
          >
            Add
          </button>
        </div>
      </form>

      {/* Existing areas */}
      <ul className="mt-6 space-y-3">
        {zones?.map((zone) => (
          <li
            key={zone.id}
            className={`rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal ${
              zone.active ? "" : "opacity-60"
            }`}
          >
            <form action={saveZone} className="space-y-3">
              <input type="hidden" name="id" value={zone.id} />
              <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
                <input name="name" defaultValue={zone.name} required className={inputClass} />
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-plum/60">
                    {currency}
                  </span>
                  <input
                    name="fee"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    defaultValue={zone.fee}
                    required
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={zone.active}
                    className="h-5 w-5 accent-rosy"
                  />
                  Available at checkout
                </label>
                <div className="flex items-center gap-4">
                  <ConfirmButton
                    formAction={deleteZone}
                    formNoValidate
                    message={`Delete "${zone.name}"?`}
                    className="text-sm text-berry underline hover:text-plum"
                  >
                    Delete
                  </ConfirmButton>
                  <button
                    type="submit"
                    className="rounded-full border border-pink-soft px-5 py-2 text-sm transition-colors hover:bg-petal"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </li>
        ))}
      </ul>

      {zones?.length === 0 && (
        <p className="py-12 text-center text-plum/60">
          No delivery areas yet. Until you add one, customers can only choose pickup or order on
          WhatsApp.
        </p>
      )}
    </div>
  );
}