import Link from "next/link";
import { connection } from "next/server";
import { AuthControls } from "@/app/components/auth-controls";
import { DarkModeToggle } from "@/app/components/dark-mode-toggle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const instant = false;

export default async function SettingsPage() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Unable to load the account settings.", error);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#737373]">
          Preferences
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.055em] text-[#171717] sm:text-[34px]">
          Settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
          Manage your account and review the preferences currently available
          in SmartCampus.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)]">
        <section className="rounded-[20px] border border-[#e5e5e5] bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[#171717]">Account details</h2>
          <p className="mt-1 text-xs leading-5 text-[#777]">
            Sign-in is managed securely by Supabase. Password values are never
            displayed in this workspace.
          </p>
          <dl className="mt-5 divide-y divide-[#eeeeec]">
            <div className="grid gap-1 py-3 sm:grid-cols-[140px_1fr]">
              <dt className="text-[10px] text-[#858585]">Email address</dt>
              <dd className="break-all text-xs font-medium text-[#333]">
                {user?.email ?? "Unavailable"}
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[140px_1fr]">
              <dt className="text-[10px] text-[#858585]">Password</dt>
              <dd className="text-xs text-[#555]">
                Protected by Supabase; it cannot be viewed here.
              </dd>
            </div>
          </dl>
          <Link
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-[#dededc] px-4 text-[10px] font-semibold text-[#333] transition hover:bg-[#f5f5f3]"
            href="/profile"
          >
            View student profile
          </Link>
        </section>

        <section className="rounded-[20px] border border-[#e5e5e5] bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[#171717]">Appearance</h2>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-[#f5f5f3] p-4">
            <div>
              <p className="text-xs font-medium text-[#333]">Dark mode</p>
              <p className="mt-1 text-[10px] leading-4 text-[#777]">
                Choose a darker appearance for SmartCampus.
              </p>
            </div>
            <DarkModeToggle variant="settings" />
          </div>
          <h2 className="mt-6 text-sm font-semibold text-[#171717]">
            Notification preferences
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#777]">
            Task reminders are calculated from saved due dates. Persistent
            preferences and push notifications are not connected yet.
          </p>
          <Link
            className="mt-4 inline-flex text-[10px] font-semibold text-[#333] underline decoration-[#bbb] underline-offset-4 hover:decoration-[#171717]"
            href="/notifications"
          >
            Review current reminders
          </Link>
        </section>
      </div>

      <section className="rounded-[20px] border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-[#171717]">Session</h2>
        <p className="mt-1 text-xs leading-5 text-[#777]">
          Sign out securely from this browser session.
        </p>
        <div className="mt-4 max-w-md">
          <AuthControls />
        </div>
      </section>
    </div>
  );
}
