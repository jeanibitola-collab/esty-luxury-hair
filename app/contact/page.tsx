import Link from "next/link";
import { site } from "../../lib/site";

export const metadata = {
  title: "Contact",
};

const faqs = [
  {
    q: "Do I need to book in advance?",
    a: "We recommend booking ahead, especially for weekends and long services like braids. Walk-ins are welcome when we have space.",
  },
  {
    q: "What if I’m running late?",
    a: "Please message us as soon as you can. If you’re more than 20 minutes late we may need to shorten or reschedule your appointment.",
  },
  {
    q: "How do I cancel or reschedule?",
    a: "Just send us a WhatsApp message at least 24 hours before your appointment and we’ll sort it out.",
  },
  {
    q: "Should I come with my hair washed?",
    a: "For braids and installs, please come with clean, detangled hair unless you’ve booked a wash with your service.",
  },
];

export default function ContactPage() {
  const telLink = `tel:${site.phone.replace(/\s/g, "")}`;
  const whatsappLink = `https://wa.me/${site.whatsapp}`;
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address)}`;

  const actions = [
    { label: "Call", icon: "📞", href: telLink, external: false },
    { label: "WhatsApp", icon: "💬", href: whatsappLink, external: true },
    { label: "Instagram", icon: "📸", href: site.instagram, external: true },
  ];

  return (
    <>
      {/* Page header */}
      <section className="bg-gradient-to-b from-petal to-blush">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-berry md:text-sm">
            Say hello
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-lg text-plum/80">
            Questions, special requests or just want to say hi? We’d love to hear from you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 md:mx-auto md:max-w-xl">
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex flex-col items-center rounded-3xl bg-white py-5 shadow-sm ring-1 ring-petal transition-colors hover:bg-petal"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="mt-2 text-sm font-medium">{a.label}</span>
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Hours + address */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-petal">
              <h2 className="font-display text-xl">Opening Hours</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {site.hours.map((h) => (
                  <li
                    key={h.days}
                    className="flex justify-between border-b border-petal pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-plum/70">{h.days}</span>
                    <span className="font-medium">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-petal">
              <h2 className="font-display text-xl">Visit Us</h2>
              <p className="mt-3 text-sm">{site.address}</p>
              <p className="mt-1 text-sm">{site.phone}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-rosy px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-berry"
                >
                  Get Directions
                </a>
                <Link
                  href="/book"
                  className="rounded-full border-2 border-rosy px-6 py-3 text-center text-sm font-medium text-berry transition-colors hover:bg-rosy hover:text-white"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-3xl shadow-sm ring-1 ring-petal">
            <iframe
              src={mapEmbed}
              title={`Map showing ${site.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0 md:h-full md:min-h-96"
            />
          </div>
        </div>

        {/* FAQ */}
        <section className="mx-auto mt-14 max-w-2xl">
          <h2 className="text-center font-display text-2xl md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-3xl bg-white px-5 py-4 shadow-sm ring-1 ring-petal"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span className="text-xl text-berry transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-plum/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}