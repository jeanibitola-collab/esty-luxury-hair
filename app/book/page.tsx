import { Suspense } from "react";
import BookingForm from "../../components/BookingForm";
import { getServices } from "../../lib/catalog";

export const metadata = {
  title: "Book an Appointment",
};

export default async function BookPage() {
  const services = await getServices();

  return (
    <>
      <section className="bg-gradient-to-b from-petal to-blush">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-berry md:text-sm">
            Treat yourself
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Book an Appointment</h1>
          <p className="mx-auto mt-4 max-w-lg text-plum/80">
            Pick your service, day and time. It only takes a minute.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Suspense fallback={<div className="py-24" />}>
          <BookingForm services={services} />
        </Suspense>
      </div>
    </>
  );
}