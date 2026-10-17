import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import type { Product } from "./products";
import type { OrderItem, Method, DeliveryZone } from "./checkout";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string[] | null;
  image_url: string | null;
  emoji: string;
  in_stock: boolean;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description,
    details: row.details ?? [],
    image: row.image_url,
    emoji: row.emoji,
    inStock: row.in_stock,
  };
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load products: ${error.message}`);
  return (data as ProductRow[]).map(toProduct);
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

// Active delivery areas, cheapest first
export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  "use cache";
  cacheTag("delivery-zones");
  cacheLife("hours");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("id, name, fee")
    .eq("active", true)
    .order("fee", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(`Could not load delivery areas: ${error.message}`);
  return data as DeliveryZone[];
}

// Works out the real total from database prices (never trusts the browser)
export async function calculateOrder(items: OrderItem[], method: Method, zoneId?: string) {
  const [products, zones] = await Promise.all([getProducts(), getDeliveryZones()]);

  const lines = items.flatMap((item) => {
    const product = products.find((p) => p.slug === item.slug);
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !product.inStock || !(quantity >= 1 && quantity <= 20)) return [];
    return [{ product, quantity }];
  });

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const zone = method === "delivery" ? zones.find((z) => z.id === zoneId) ?? null : null;
  const delivery = zone?.fee ?? 0;

  return { lines, subtotal, delivery, zone, total: subtotal + delivery };
}