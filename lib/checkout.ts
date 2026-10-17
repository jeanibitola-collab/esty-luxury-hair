export type OrderItem = { slug: string; quantity: number };
export type Method = "pickup" | "delivery";
export type DeliveryZone = { id: string; name: string; fee: number };