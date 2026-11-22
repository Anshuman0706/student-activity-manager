import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AuthBrandingPanel } from "@/app/components/auth-branding-panel";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthForm } from "@/app/login/ui/auth-form";

export default function RegisterPage() {
  return (
    <main className="auth-page mx-auto flex min-h-screen w-full max-w-[1240px] items-center justify-center px-4 py-5 sm:px-6 lg:py-8">
      <Suspense
        fallback={
          <div className="auth-loading-card w-full max-w-md rounded-3xl border p-8 text-sm">
            Loading registration…
          </div>
        }
      >
        <RegisterContent />
      </Suspense>
    </main>
  );
}

async function RegisterContent() {
  await connection();

  if (getSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
      <div className="auth-layout grid w-full overflow-hidden rounded-[28px] border shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
        <AuthBrandingPanel />

        <section className="auth-form-area flex min-h-[620px] items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <AuthForm initialMode="signup" />
            <p className="auth-switch-copy mt-5 text-center text-[10px]">
              Already have an account?{" "}
              <Link
                className="auth-switch-link font-semibold underline underline-offset-4"
                href="/login"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
  );
}
