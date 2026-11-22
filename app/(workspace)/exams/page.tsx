import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ExamForm } from "@/app/exams/ui/exam-form";
import { getDeadlinePriority } from "@/lib/deadline-priority";
import { getCurrentStudentExams } from "@/lib/exams/data";
import { getDaysUntil, getTodayInAppTimeZone } from "@/lib/tasks/dates";

export default function ExamsPage() {
  return (
    <div className="space-y-7">
      <header>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#737373]">
          Study workspace
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.045em] text-[#171717] sm:text-[34px]">
          Exam planner
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
          Save your exam dates and see upcoming exams and priority at a glance.
        </p>
      </header>
      <section
        className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6"
        id="add-exam"
      >
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#252525]">Add an exam</h2>
          <p className="mt-1 text-xs leading-5 text-[#737373]">
            Priority is based on the days remaining until the exam.
          </p>
        </div>
        <ExamForm />
      </section>
      <Suspense fallback={<ExamsLoading />}>
        <ExamsContent />
      </Suspense>
    </div>
  );
}

function ExamsLoading() {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 text-sm text-[#737373]">
      Loading your exam schedule…
    </div>
  );
}

async function ExamsContent() {
  const result = await getCurrentStudentExams();

  if (result.status === "signed-out") {
    redirect("/login");
  }

  if (result.status === "setup") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
        <h2 className="font-semibold text-[#252525]">Connect your Supabase project</h2>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Configure Supabase and apply the exam planner migration before saving
          exam dates.
        </p>
        <Link className="mt-4 inline-block text-sm font-semibold text-[#171717]" href="/login">
          Open account setup
        </Link>
      </section>
    );
  }

  if (result.status === "migration-required") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
        <h2 className="font-semibold text-[#252525]">Exam planner needs setup</h2>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Apply <code>supabase/migrations/20261017020000_student_exams.sql</code>{" "}
          in your Supabase project&apos;s SQL Editor. Then refresh this page to
          save and view exams.
        </p>
      </section>
    );
  }

  if (result.status === "error") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
        <h2 className="font-semibold text-[#444444]">Exam schedule is unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-[#555555]">
          Apply the exam planner migration and check the Supabase connection,
          then refresh this page.
        </p>
      </section>
    );
  }

  const today = getTodayInAppTimeZone();
  const upcomingExams = result.exams.filter((exam) => exam.exam_date >= today);
  const pastExams = result.exams.filter((exam) => exam.exam_date < today);

  return (
    <section className="space-y-6">
      <ExamList exams={upcomingExams} title="Upcoming exams" today={today} />
      {pastExams.length ? (
        <ExamList exams={pastExams} title="Past exams" today={today} />
      ) : null}
    </section>
  );
}

function ExamList({
  exams,
  title,
  today,
}: {
  exams: { id: string; subject: string; exam_date: string }[];
  title: string;
  today: string;
}) {
  return (
    <section className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[#252525]">{title}</h2>
        <span className="rounded-full bg-[#eeeeec] px-2.5 py-1 text-[9px] font-semibold text-[#444]">
          {exams.length}
        </span>
      </div>
      {exams.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#dededb] px-4 py-8 text-center text-sm text-[#737373]">
          No {title.toLowerCase()} yet. Add an exam above to get started.
        </p>
      ) : (
        <ul className="divide-y divide-[#eeeeec]">
          {exams.map((exam) => {
            const daysUntil = getDaysUntil(exam.exam_date, today);
            const priority = getDeadlinePriority(daysUntil);
            const formattedDate = new Intl.DateTimeFormat("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(`${exam.exam_date}T12:00:00Z`));

            return (
              <li
                className="flex flex-wrap items-center justify-between gap-3 py-4"
                key={exam.id}
              >
                <div>
                  <h3 className="text-sm font-semibold text-[#252525]">{exam.subject}</h3>
                  <p className="mt-1 text-xs text-[#737373]">
                    {formattedDate}
                    {daysUntil < 0
                      ? ` · ${Math.abs(daysUntil)} day(s) ago`
                      : daysUntil === 0
                        ? " · Today"
                        : ` · ${daysUntil} day(s) left`}
                  </p>
                </div>
                <span className="rounded-full bg-[#eeeeec] px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] text-[#444]">
                  {priority} PRIORITY
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
