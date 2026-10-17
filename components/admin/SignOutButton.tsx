"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-pink-soft bg-white px-4 py-2 text-sm transition-colors hover:bg-petal"
    >
      Sign out
    </button>
  );
}