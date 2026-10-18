"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { saveService, type FormState } from "../../lib/admin-actions";
import { currency, formatDuration } from "../../lib/services";

export type AdminService = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  price_from: boolean;
  active: boolean;
};

const inputClass =
  "w-full rounded-2xl border border-pink-soft bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rosy";
const labelClass = "mb-1.5 block text-sm font-medium";

export default function ServiceForm({
  service,
  categories,
}: {
  service?: AdminService;
  categories: string[];
}) {
  const [state, formAction, saving] = useActionState<FormState, FormData>(saveService, {});
  const [duration, setDuration] = useState(String(service?.duration ?? 60));
  const minutes = Number(duration);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {service && <input type="hidden" name="id" value={service.id} />}

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>Service name</label>
        <input id="name" name="name" defaultValue={service?.name} required className={inputClass} />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className={labelClass}>Category</label>
        <input
          id="category"
          name="category"
          list="service-category-options"
          defaultValue={service?.category}
          placeholder="Pick one or type a new category"
          required
          className={inputClass}
        />
        <datalist id="service-category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className={labelClass}>Price</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-plum/60">{currency}</span>
          <input
            id="price"
            name="price"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            defaultValue={service?.price}
            required
            className={`${inputClass} pl-9`}
          />
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="price_from"
            defaultChecked={service?.price_from ?? false}
            className="h-5 w-5 accent-rosy"
          />
          Show as “From” price (for prices that depend on length or size)
        </label>
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration" className={labelClass}>Duration (minutes)</label>
        <input
          id="duration"
          name="duration"
          type="number"
          inputMode="numeric"
          min={5}
          max={720}
          step={5}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className={`${inputClass} w-40`}
        />
        <p className="mt-1.5 text-xs text-plum/60">
          {minutes >= 5 ? `= ${formatDuration(minutes)}. ` : ""}
          This decides which time slots customers can book.
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={service?.description}
          className={inputClass}
        />
      </div>

      {/* Active */}
      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-pink-soft bg-white p-4">
        <input
          type="checkbox"
          name="active"
          defaultChecked={service?.active ?? true}
          className="h-5 w-5 accent-rosy"
        />
        <span>
          <span className="block font-medium">Show on website</span>
          <span className="block text-sm text-plum/60">
            Untick to hide it from the Services and Booking pages.
          </span>
        </span>
      </label>

      {state.error && <p className="text-sm text-berry">{state.error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-rosy px-10 py-3 font-medium text-white shadow-sm transition-colors hover:bg-berry disabled:opacity-60"
        >
          {saving ? "Saving…" : service ? "Save Changes" : "Add Service"}
        </button>
        <Link
          href="/admin/services"
          className="rounded-full border border-pink-soft bg-white px-10 py-3 text-center transition-colors hover:bg-petal"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}