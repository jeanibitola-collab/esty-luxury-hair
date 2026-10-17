"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  categories,
  services,
  formatDuration,
  formatPrice,
} from "../lib/services";
import {
  getUpcomingDays,
  getTimeSlots,
  isOpen,
  formatTime,
} from "../lib/booking";
import { site } from "../lib/site";

const inputClass =
  "w-full rounded-2xl border border-pink-soft bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rosy";

function StepTitle({ number, title }: { number: number; title: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-3 font-display text-xl">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rosy font-sans text-sm font-semibold text-white">
        {number}
      </span>
      {title}
    </h2>
  );
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const fromLink = searchParams.get("service");
  const initialService = services.some((s) => s.id === fromLink) ? fromLink! : "";

  const [serviceId, setServiceId] = useState(initialService);
  const [now, setNow] = useState<Date | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  // Get today's date in the visitor's browser
  useEffect(() => {
    setNow(new Date());
  }, []);

  const service = services.find((s) => s.id === serviceId);
  const days = useMemo(() => (now ? getUpcomingDays(now) : []), [now]);
  const slots = useMemo(
    () => (service && date && now ? getTimeSlots(date, service.duration, now) : []),
    [service, date, now]
  );

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!service || !date || time === null || !name.trim() || !phone.trim()) {
      setError("Please choose a service, date and time, and enter your name and phone number.");
      return;
    }
    setError("");

    const message = [
      `Hi ${site.name}! I'd like to book an appointment 💕`,
      "",
      `Service: ${service.name} (${formatPrice(service)})`,
      `Date: ${formatDate(date)}`,
      `Time: ${formatTime(time)}`,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      notes.trim() ? `Notes: ${notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    setSent(true);
  };

  if (!now) return <div className="py-24" />;

  if (sent) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-petal">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-petal text-3xl">
          💌
        </div>
        <h2 className="mt-4 font-display text-2xl">Almost done!</h2>
        <p className="mt-2 text-plum/75">
          Your booking message is ready in WhatsApp. Just tap <strong>send</strong>, and
          we’ll reply to confirm your appointment.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-berry underline"
        >
          WhatsApp didn’t open? Go back and try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* 1. Service */}
      <section>
        <StepTitle number={1} title="Choose a service" />
        <select
          value={serviceId}
          onChange={(e) => {
            setServiceId(e.target.value);
            setTime(null);
          }}
          className={inputClass}
        >
          <option value="">Select a service…</option>
          {categories.map((category) => (
            <optgroup key={category} label={category}>
              {services
                .filter((s) => s.category === category)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {formatPrice(s)}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        {service && (
          <p className="mt-2 text-sm text-plum/70">
            ⏱ Takes about {formatDuration(service.duration)}
          </p>
        )}
      </section>

      {/* 2. Date */}
      <section>
        <StepTitle number={2} title="Pick a day" />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {days.map((d) => {
            const open = isOpen(d);
            const selected = date?.toDateString() === d.toDateString();
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={!open}
                onClick={() => {
                  setDate(d);
                  setTime(null);
                }}
                className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2 transition-colors ${
                  selected
                    ? "border-rosy bg-rosy text-white"
                    : open
                    ? "border-pink-soft bg-white hover:bg-petal"
                    : "cursor-not-allowed border-petal bg-petal/50 text-plum/30"
                }`}
              >
                <span className="text-xs">
                  {d.toLocaleDateString("en-GB", { weekday: "short" })}
                </span>
                <span className="text-lg font-semibold">{d.getDate()}</span>
                <span className="text-xs">
                  {d.toLocaleDateString("en-GB", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Time */}
      <section>
        <StepTitle number={3} title="Pick a time" />
        {!service || !date ? (
          <p className="text-sm text-plum/60">Choose a service and a day first.</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-plum/60">
            No times left on this day for this service. Please pick another day.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={`rounded-full border py-2 text-sm transition-colors ${
                  time === t
                    ? "border-rosy bg-rosy text-white"
                    : "border-pink-soft bg-white hover:bg-petal"
                }`}
              >
                {formatTime(t)}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 4. Details */}
      <section>
        <StepTitle number={4} title="Your details" />
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className={inputClass}
          />
          <textarea
            placeholder="Anything we should know? (hair length, colour, inspiration…) – optional"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>
      </section>

      {/* Summary + submit */}
      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal">
        <h2 className="font-display text-xl">Your appointment</h2>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-plum/60">Service</dt>
            <dd className="text-right">{service ? service.name : "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-plum/60">Date</dt>
            <dd className="text-right">{date ? formatDate(date) : "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-plum/60">Time</dt>
            <dd className="text-right">{time !== null ? formatTime(time) : "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-petal pt-2 font-semibold">
            <dt>Price</dt>
            <dd className="text-berry">{service ? formatPrice(service) : "—"}</dd>
          </div>
        </dl>

        {error && <p className="mt-4 text-sm text-berry">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-rosy py-3 font-medium text-white shadow-sm transition-colors hover:bg-berry"
        >
          Confirm on WhatsApp
        </button>
        <p className="mt-2 text-center text-xs text-plum/60">
          We’ll reply on WhatsApp to confirm your booking.
        </p>
      </section>
    </form>
  );
}