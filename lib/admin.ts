import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "./supabase/server";

export async function requireAdmin() {
  // Admin pages depend on who is logged in, so always build them fresh
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) redirect("/admin/login");

  return { supabase, user };
}