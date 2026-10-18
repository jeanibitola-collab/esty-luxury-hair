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
export async function saveZone(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const fee = Number(formData.get("fee"));
  const active = formData.get("active") === "on";

  if (!name || !Number.isFinite(fee) || fee < 0) return;

  const values = { name, fee: Math.round(fee), active };

  if (id) {
    await supabase.from("delivery_zones").update(values).eq("id", id);
  } else {
    await supabase.from("delivery_zones").insert(values);
  }

  updateTag("delivery-zones"); // checkout shows the new fees straight away
  revalidatePath("/admin/delivery");
}

export async function deleteZone(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("delivery_zones").delete().eq("id", id);

  updateTag("delivery-zones");
  revalidatePath("/admin/delivery");
}

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const duration = Number(formData.get("duration"));
  const price = Number(formData.get("price"));
  const price_from = formData.get("price_from") === "on";
  const active = formData.get("active") === "on";

  if (!name) return { error: "Please enter a service name." };
  if (!category) return { error: "Please enter a category." };
  if (!Number.isFinite(price) || price < 0) return { error: "Please enter a valid price." };
  if (!Number.isFinite(duration) || duration < 5 || duration > 720)
    return { error: "Duration must be between 5 and 720 minutes." };

  const values = {
    name,
    category,
    description,
    duration: Math.round(duration),
    price: Math.round(price),
    price_from,
    active,
  };

  if (id) {
    const { error } = await supabase.from("services").update(values).eq("id", id);
    if (error) return { error: error.message };
  } else {
    // New services go to the end of the list
    const { data: last } = await supabase
      .from("services")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sort_order = (last?.sort_order ?? 0) + 1;

    let newId = slugify(name) || "service";
    let { error } = await supabase.from("services").insert({ ...values, id: newId, sort_order });
    if (error?.code === "23505") {
      newId = `${newId}-${Math.random().toString(36).slice(2, 6)}`;
      ({ error } = await supabase.from("services").insert({ ...values, id: newId, sort_order }));
    }
    if (error) return { error: error.message };
  }

  updateTag("services"); // refresh Services, Booking and Search straight away
  redirect("/admin/services?saved=1");
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("services").delete().eq("id", id);

  updateTag("services");
  redirect("/admin/services?deleted=1");
}

export async function toggleService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  if (!id) return;

  await supabase.from("services").update({ active }).eq("id", id);

  updateTag("services");
  revalidatePath("/admin/services");
}