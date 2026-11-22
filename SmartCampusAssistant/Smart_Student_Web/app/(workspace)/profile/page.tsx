import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileSemesterForm } from "./profile-semester-form";
import { ProfileMobileNumberForm } from "./profile-mobile-number-form";

export const instant = false;

export default async function ProfilePage() {
  await connection();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the profile session.", authError);
    redirect("/login?error=session");
  }

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, mobile_number, branch, semester")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Unable to load the student profile.", profileError);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <header>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#737373]">
          Student account
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.045em] text-[#171717] sm:text-[34px]">
          Your profile
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Student details linked to your account.
        </p>
      </header>

      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-7">
        <h2 className="text-base font-semibold text-[#252525]">Account details</h2>
        <dl className="mt-4 divide-y divide-[#eeeeec]">
          <div className="grid gap-1 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
            <dt className="text-xs font-medium text-[#858585]">Email address</dt>
            <dd className="break-all text-sm font-semibold text-[#252525]">
              {user.email ?? "No email address available"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-7">
        <h2 className="text-base font-semibold text-[#252525]">Student details</h2>
        {profileError ? (
          <p className="mt-4 rounded-xl bg-[#eeeeec] px-4 py-3 text-sm leading-6 text-[#555555]">
            We couldn&apos;t load your student details. Check the Supabase profile
            table and RLS policies, then refresh this page.
          </p>
        ) : profile ? (
          <dl className="mt-4 divide-y divide-[#eeeeec]">
            <ProfileRow label="Full name" value={profile.full_name} />
            <div className="grid gap-1 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
              <dt className="text-xs font-medium text-[#858585]">Mobile number</dt>
              <dd>
                <ProfileMobileNumberForm mobileNumber={profile.mobile_number ?? ""} />
              </dd>
            </div>
            <ProfileRow label="Branch" value={profile.branch} />
            <div className="grid gap-1 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
              <dt className="text-xs font-medium text-[#858585]">Semester</dt>
              <dd>
                <ProfileSemesterForm semester={profile.semester} />
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 rounded-xl bg-[#f5f5f3] px-4 py-3 text-sm leading-6 text-[#737373]">
            Student details are not available for this account yet.
          </p>
        )}
      </section>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-xs font-medium text-[#858585]">{label}</dt>
      <dd className="text-sm font-semibold text-[#252525]">{value}</dd>
    </div>
  );
}
