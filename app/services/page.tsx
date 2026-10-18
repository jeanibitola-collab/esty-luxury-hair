import Link from "next/link";
import { getServices } from "../../lib/catalog";
import { formatDuration, formatPrice, getServiceCategories } from "../../lib/services";

export const metadata = {
  title: "Services",
};

export default async function ServicesPage() {
  const services = await getServices();
  const categories = getServiceCategories(services);

  return (
    <>
      {/* Page header */}
      <section className="bg-gradient-to-b from-petal to-blush">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-berry md:text-sm">
            What we do
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Our Services</h1>
          <p className="mx-auto mt-4 max-w-lg text-plum/80">
            Choose a service below and book your appointment in seconds.
          </p>
        </div>
      </section>

      {/* Quick-jump category links (scrolls sideways on phones) */}
      <nav className="sticky top-[57px] z-40 border-b border-petal bg-blush/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {categories.map((category) => (
            <a
              key={category}
              href={`#${slugify(category)}`}
              className="shrink-0 rounded-full border border-pink-soft bg-white px-4 py-1.5 text-sm transition-colors hover:bg-petal"
            >
              {category}
            </a>
          ))}
        </div>
      </nav>

      {/* Services grouped by category */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {categories.map((category) => (
          <section key={category} id={slugify(category)} className="scroll-mt-32 pb-10">
            <h2 className="mb-5 font-display text-2xl md:text-3xl">{category}</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {services
                .filter((s) => s.category === category)
                .map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-petal"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-medium">{service.name}</h3>
                      <p className="shrink-0 font-semibold text-berry">{formatPrice(service)}</p>
                    </div>

                    <p className="mt-2 flex-1 text-sm text-plum/75">{service.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-petal px-3 py-1 text-xs">
                        ⏱ {formatDuration(service.duration)}
                      </span>
                      <Link
                        href={`/book?service=${service.id}`}
                        className="rounded-full bg-rosy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-berry"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

// Turns "Wigs & Installs" into "wigs-installs" for the jump links
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}