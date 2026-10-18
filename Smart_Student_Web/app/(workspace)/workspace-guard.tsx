import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/app/components/app-shell";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function WorkspaceGuard({ children }: { children: ReactNode }) {
  await connection();

  if (!getSupabaseConfig()) {
    redirect("/login?error=setup");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Unable to verify the workspace session.", error);
    redirect("/login?error=session");
  }

  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
