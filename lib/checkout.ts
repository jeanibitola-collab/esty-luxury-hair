// Flat delivery fee in Naira. Change this to the salon's real fee.
export const DELIVERY_FEE = 3000;

export type OrderItem = { slug: string; quantity: number };
export type Method = "pickup" | "delivery";