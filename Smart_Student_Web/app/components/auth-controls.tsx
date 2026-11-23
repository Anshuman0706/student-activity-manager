import Link from "next/link";
import { connection } from "next/server";
import { signOutAction } from "@/app/auth/actions";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AuthControls() {
  await connection();
  const buttonClassName =
    "rounded-lg px-3 py-2 text-[10px] font-semibold text-[#666] transition hover:bg-[#f1f1ef] hover:text-[#171717]";

  if (!getSupabaseConfig()) {
    return (
      <Link
        className="block rounded-xl bg-[#080808] px-4 py-3 text-center text-xs font-semibold text-white transition hover:bg-[#303030]"
        href="/login"
      >
        Set up sign-in
      </Link>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Unable to load the current account controls.", error);
    return (
      <Link className="text-xs font-semibold text-[#555]" href="/login">
        Sign-in status unavailable
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        className="rounded-xl bg-[#080808] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#303030]"
        href="/login"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        className="flex min-w-0 flex-1 items-center gap-2 rounded-xl p-2 transition hover:bg-[#f1f1ef]"
        href="/profile"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e5e5e3] text-[10px] font-semibold text-[#333]">
          {(user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? "S").toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[10px] font-semibold text-[#333]">
            {user.user_metadata?.full_name ?? "Student account"}
          </span>
          <span className="block truncate text-[9px] text-[#888]">
            {user.email}
          </span>
        </span>
      </Link>
      <form action={signOutAction}>
        <button aria-label="Sign out" className={buttonClassName} type="submit">
          Sign out
        </button>
      </form>
    </div>
  );
}
