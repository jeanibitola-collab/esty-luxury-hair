import Image from "next/image";
import type { Product } from "../lib/products";

export default function ProductImage({
  product,
  sizes,
}: {
  product: Product;
  sizes: string;
}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-petal to-pink-soft">
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-5xl md:text-6xl">
          {product.emoji}
        </div>
      )}
    </div>
  );
}