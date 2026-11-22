import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AttendanceManager } from "@/app/attendance/ui/attendance-manager";
import { getAttendanceWorkspace } from "@/lib/attendance/data";
import { getAttendanceThreshold } from "@/lib/attendance/policy";

export const instant = false;

export default function AttendancePage() {
  const threshold = getAttendanceThreshold();

  return (
    <div className="space-y-6">
      <header>
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#737373]">
          Academic progress
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.055em] text-[#171717] sm:text-[34px]">
          Attendance
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
          Monitor class totals and compare your attendance with the configured
          {` ${threshold}% `}institutional target.
        </p>
      </header>

      <Suspense fallback={<AttendanceLoading />}>
        <AttendanceContent threshold={threshold} />
      </Suspense>
    </div>
  );
}

function AttendanceLoading() {
  return (
    <div className="rounded-[20px] border border-[#e5e5e5] bg-white p-6 text-sm text-[#737373]">
      Loading attendance records…
    </div>
  );
}

async function AttendanceContent({ threshold }: { threshold: number }) {
  const result = await getAttendanceWorkspace();

  if (result.status === "signed-out") {
    redirect("/login");
  }

  if (result.status === "setup") {
    return (
      <section className="rounded-[20px] border border-[#e5e5e5] bg-white p-6">
        <h2 className="font-semibold text-[#252525]">Connect your Supabase project</h2>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Configure Supabase and apply the student attendance migration before
          tracking subject totals.
        </p>
        <Link className="mt-4 inline-block text-sm font-semibold text-[#171717]" href="/login">
          Open account setup
        </Link>
      </section>
    );
  }

  if (result.status === "error") {
    return (
      <section className="rounded-[20px] border border-[#e5e5e5] bg-white p-6">
        <h2 className="font-semibold text-[#252525]">Attendance is unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-[#555]">
          We couldn&apos;t load your attendance records. Check the Supabase
          connection and migration, then refresh the page.
        </p>
      </section>
    );
  }

  return (
    <AttendanceManager
      isAdmin={result.isAdmin}
      records={result.records}
      studentId={result.studentId}
      students={result.students}
      threshold={threshold}
    />
  );
}
