import Link from "next/link";
import { getImageProps } from "next/image";
import { site } from "../lib/site";

const highlights = [
  {
    icon: "✨",
    title: "Expert Hair Care",
    text: "Braids, locs, wig installs, silk presses and treatments by skilled stylists.",
  },
  {
    icon: "💅",
    title: "Lashes & Nails",
    text: "Lash extensions, manicures and pedicures to complete your look.",
  },
  {
    icon: "🛍️",
    title: "Quality Products",
    text: "Hair care, wigs and accessories we trust and use ourselves.",
  },
  {
    icon: "📅",
    title: "Easy Booking",
    text: "Pick your service and time in under a minute.",
  },
];

export default function Home() {
  // Different photo for phones and laptops
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    alt: "",
    src: "/hero-desktop.jpg",
    width: 2048,
    height: 1152,
    sizes: "100vw",
    quality: 80,
  });

  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({
    alt: "Woman with a glamorous styled hairdo",
    src: "/hero-mobile.jpg",
    width: 736,
    height: 1308,
    sizes: "100vw",
    quality: 80,
    loading: "eager",
  });
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-plum">
        {/* Photo: full background on all screens */}
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet={desktopSrcSet}
            sizes="100vw"
          />
          <source
            media="(max-width: 767px)"
            srcSet={mobileSrcSet}
            sizes="100vw"
          />
          <img
            {...imgProps}
            className="absolute inset-0 h-full w-full object-cover object-top md:object-center"
          />
        </picture>

        {/* Dark fade: from the bottom on phones, from the left on laptops */}
        <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-plum/25 to-transparent md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-plum/85 via-plum/40 to-transparent md:block" />

        {/* Text */}
        <div className="relative mx-auto flex min-h-[85svh] max-w-6xl flex-col justify-end px-4 pb-10 pt-40 text-center text-white md:min-h-[80vh] md:justify-center md:py-24 md:text-left">
          <div className="md:max-w-md">
            <p className="text-xs uppercase tracking-[0.25em] text-pink-soft md:text-sm">
              Welcome to {site.name}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
              Luxury hair &amp; beauty,{" "}
              <span className="italic text-pink-soft">made for you</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-white/90 md:mx-0 md:text-lg">
              From braids, locs and flawless installs to lashes and nails, we
              take care of everything that makes you feel your best.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/book"
                className="rounded-full bg-rosy px-8 py-3 text-center font-medium text-white shadow-md transition-colors hover:bg-berry"
              >
                Book Appointment
              </Link>
              <Link
                href="/shop"
                className="rounded-full border-2 border-white px-8 py-3 text-center font-medium text-white transition-colors hover:bg-white hover:text-berry"
              >
                Shop Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-petal"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-petal text-2xl">
              {item.icon}
            </div>
            <h3 className="mt-4 font-display text-xl">{item.title}</h3>
            <p className="mt-2 text-sm text-plum/75">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Call to action */}
      <section className="px-4">
        <div className="mx-auto max-w-6xl rounded-3xl bg-rosy px-6 py-12 text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl">
            Ready for your new look?
          </h2>
          <p className="mt-3 text-white/90">
            Spots fill up fast, so reserve yours today.
          </p>
          <Link
            href="/book"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-medium text-berry transition-colors hover:bg-petal"
          >
            Book Now
          </Link>
        </div>
      </section>
    </>
  );
}
