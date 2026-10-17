"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./admin";

export type FormState = { error?: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const description = String(formData.get("description") ?? "").trim();
  const details = String(formData.get("details") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const emoji = String(formData.get("emoji") ?? "").trim() || "🛍️";
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const in_stock = formData.get("in_stock") === "on";

  if (!name) return { error: "Please enter a product name." };
  if (!category) return { error: "Please enter a category." };
  if (!Number.isFinite(price) || price < 0) return { error: "Please enter a valid price." };

  const values = {
    name,
    category,
    price: Math.round(price),
    description,
    details,
    emoji,
    image_url,
    in_stock,
  };

  if (id) {
    // Edit existing product (its web address stays the same)
    const { error } = await supabase.from("products").update(values).eq("id", id);
    if (error) return { error: error.message };
  } else {
    // New product: create a web address from the name
    let slug = slugify(name) || "product";
    let { error } = await supabase.from("products").insert({ ...values, slug });
    if (error?.code === "23505") {
      // That address is taken, so add a short random ending
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      ({ error } = await supabase.from("products").insert({ ...values, slug }));
    }
    if (error) return { error: error.message };
  }

  updateTag("products"); // refresh the shop straight away
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const imageUrl = String(formData.get("image_url") ?? "");
  if (!id) return;

  await supabase.from("products").delete().eq("id", id);

  // Remove the photo from storage too
  const path = imageUrl.split("/product-images/")[1];
  if (path) await supabase.storage.from("product-images").remove([path]);

  updateTag("products");
  redirect("/admin/products?deleted=1");
}

export async function toggleStock(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const inStock = formData.get("in_stock") === "true";
  if (!id) return;

  await supabase.from("products").update({ in_stock: inStock }).eq("id", id);

  updateTag("products");
  revalidatePath("/admin/products");
}