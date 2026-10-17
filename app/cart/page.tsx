import CartView from "../../components/CartView";

export const metadata = {
  title: "Your Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="mb-6 font-display text-3xl md:text-4xl">Your Cart</h1>
      <CartView />
    </div>
  );
}