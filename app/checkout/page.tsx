import CheckoutView from "../../components/CheckoutView";
import { getDeliveryZones } from "../../lib/catalog";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const zones = await getDeliveryZones();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="mb-6 font-display text-3xl md:text-4xl">Checkout</h1>
      <CheckoutView zones={zones} />
    </div>
  );
}