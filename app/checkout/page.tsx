import CheckoutView from "../../components/CheckoutView";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="mb-6 font-display text-3xl md:text-4xl">Checkout</h1>
      <CheckoutView />
    </div>
  );
}