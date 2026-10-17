"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useRef, useState } from "react";
import { saveProduct, type FormState } from "../../lib/admin-actions";
import { createClient } from "../../lib/supabase/client";
import { currency } from "../../lib/services";

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string[] | null;
  emoji: string;
  image_url: string | null;
  in_stock: boolean;
};

const inputClass =
  "w-full rounded-2xl border border-pink-soft bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rosy";
const labelClass = "mb-1.5 block text-sm font-medium";

// Shrink big phone photos before uploading
async function compressImage(file: File, maxSize = 1200): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not process image"))),
      "image/jpeg",
      0.85
    )
  );
}

export default function ProductForm({
  product,
  categories,
}: {
  product?: AdminProduct;
  categories: string[];
}) {
  const [state, formAction, saving] = useActionState<FormState, FormData>(saveProduct, {});
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const blob = await compressImage(file);
      const supabase = createClient();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, blob, { contentType: "image/jpeg" });
      if (error) throw error;

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch {
      setUploadError("Couldn’t upload that photo. Please try a JPG or PNG.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="image_url" value={imageUrl} />

      {/* Photo */}
      <div>
        <span className={labelClass}>Photo</span>
        <div className="flex items-center gap-4">
          <div className="relative flex aspect-square w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-petal to-pink-soft text-4xl">
            {imageUrl ? (
              <Image src={imageUrl} alt="Product photo" fill sizes="128px" className="object-cover" />
            ) : (
              product?.emoji ?? "🛍️"
            )}
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="block rounded-full bg-rosy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-berry disabled:opacity-60"
            >
              {uploading ? "Uploading…" : imageUrl ? "Change photo" : "Upload photo"}
            </button>
            {imageUrl && !uploading && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="block text-sm text-plum/60 underline hover:text-berry"
              >
                Remove photo
              </button>
            )}
            <p className="text-xs text-plum/50">Square photos look best.</p>
          </div>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        {uploadError && <p className="mt-2 text-sm text-berry">{uploadError}</p>}
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>Product name</label>
        <input id="name" name="name" defaultValue={product?.name} required className={inputClass} />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className={labelClass}>Category</label>
        <input
          id="category"
          name="category"
          list="category-options"
          defaultValue={product?.category}
          placeholder="Pick one or type a new category"
          required
          className={inputClass}
        />
        <datalist id="category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className={labelClass}>Price</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-plum/60">{currency}</span>
          <input
            id="price"
            name="price"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            defaultValue={product?.price}
            required
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description}
          className={inputClass}
        />
      </div>

      {/* Details */}
      <div>
        <label htmlFor="details" className={labelClass}>Details (optional)</label>
        <textarea
          id="details"
          name="details"
          rows={3}
          defaultValue={product?.details?.join("\n")}
          placeholder={"One per line, e.g.\n250ml\nSulphate-free"}
          className={inputClass}
        />
      </div>

      {/* Emoji */}
      <div>
        <label htmlFor="emoji" className={labelClass}>Emoji (shown if there’s no photo)</label>
        <input
          id="emoji"
          name="emoji"
          defaultValue={product?.emoji ?? "🛍️"}
          className={`${inputClass} w-24 text-center text-2xl`}
        />
      </div>

      {/* In stock */}
      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-pink-soft bg-white p-4">
        <input
          type="checkbox"
          name="in_stock"
          defaultChecked={product?.in_stock ?? true}
          className="h-5 w-5 accent-rosy"
        />
        <span>
          <span className="block font-medium">In stock</span>
          <span className="block text-sm text-plum/60">Untick to show it as sold out.</span>
        </span>
      </label>

      {state.error && <p className="text-sm text-berry">{state.error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-rosy px-10 py-3 font-medium text-white shadow-sm transition-colors hover:bg-berry disabled:opacity-60"
        >
          {saving ? "Saving…" : product ? "Save Changes" : "Add Product"}
        </button>
        <Link
          href="/admin/products"
          className="rounded-full border border-pink-soft bg-white px-10 py-3 text-center transition-colors hover:bg-petal"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}