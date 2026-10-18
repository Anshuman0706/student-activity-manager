import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LibraryManager } from "@/app/library/ui/library-manager";
import { getLibraryWorkspace } from "@/lib/library/data";

export const instant = false;

export default function LibraryPage() {
  return (
    <div className="space-y-7">
      <header>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#737373]">
          Campus resources
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.045em] text-[#171717] sm:text-[34px]">
          Library
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
          Record books you borrowed in person from your college library and the
          date each one must be submitted.
        </p>
      </header>
      <Suspense fallback={<LibraryLoading />}>
        <LibraryContent />
      </Suspense>
    </div>
  );
}

function LibraryLoading() {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 text-sm text-[#737373]">
      Loading your borrowed books…
    </div>
  );
}

async function LibraryContent() {
  const result = await getLibraryWorkspace();

  if (result.status === "signed-out") {
    redirect("/login");
  }

  if (result.status === "setup") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
        <h2 className="font-semibold text-[#252525]">Connect your Supabase project</h2>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Configure Supabase and apply the student library records migration
          before saving borrowed books.
        </p>
        <Link className="mt-4 inline-block text-sm font-semibold text-[#171717]" href="/login">
          Open account setup
        </Link>
      </section>
    );
  }

  if (result.status === "error") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
        <h2 className="font-semibold text-[#444444]">Library is unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-[#555555]">
          We couldn&apos;t load your borrowed books. Apply the student library
          records migration and check the Supabase connection and policies.
        </p>
      </section>
    );
  }

  return <LibraryManager loans={result.loans} />;
}
