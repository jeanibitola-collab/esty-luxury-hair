import { currency } from "./services";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string[];
  image: string | null;
  emoji: string;
  inStock: boolean;
};

// Unique categories, in the order products appear
export function getCategories(products: Product[]) {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function formatMoney(amount: number) {
  return `${currency}${amount.toLocaleString()}`;
}