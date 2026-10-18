export const currency = "₦";

export type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number; // in minutes
  price: number;
  priceFrom: boolean; // true = shows "From ₦40,000"
};

// Unique categories, in the order services appear
export function getServiceCategories(services: Service[]) {
  return Array.from(new Set(services.map((s) => s.category)));
}

// Turns 90 into "1 hr 30 min"
export function formatDuration(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs && mins) return `${hrs} hr ${mins} min`;
  if (hrs) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${mins} min`;
}

// Turns 40000 into "₦40,000" or "From ₦40,000"
export function formatPrice(service: { price: number; priceFrom?: boolean }) {
  const amount = `${currency}${service.price.toLocaleString()}`;
  return service.priceFrom ? `From ${amount}` : amount;
}