"use client";

import { deleteProduct } from "../../lib/admin-actions";

export default function DeleteProductButton({
  id,
  name,
  imageUrl,
}: {
  id: string;
  name: string;
  imageUrl: string | null;
}) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This can’t be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="image_url" value={imageUrl ?? ""} />
      <button type="submit" className="text-sm text-berry underline hover:text-plum">
        Delete this product
      </button>
    </form>
  );
}