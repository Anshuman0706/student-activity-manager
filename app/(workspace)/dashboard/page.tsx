import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AppIcon as Icon } from "@/app/components/app-icon";
import { RadialCommandBall } from "@/app/components/radial-command-ball";
import { getAttendanceWorkspace } from "@/lib/attendance/data";
import { getCurrentStudentExams } from "@/lib/exams/data";
import { getDaysUntil } from "@/lib/tasks/dates";
import { getTodayInAppTimeZone } from "@/lib/tasks/dates";
import { getCurrentStudentTasks } from "@/lib/tasks/data";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const instant = false;

const shortcuts = [
  { label: "Add a task", detail: "Capture a deadline", href: "/tasks", icon: "tasks" },
  { label: "Plan an exam", detail: "Check date priority", href: "/exams", icon: "exams" },
  { label: "Browse books", detail: "View your loans", href: "/library", icon: "library" },
  { label: "Explore placements", detail: "Career workspace", href: "/placements", icon: "placements" },
] as const;

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export default async function DashboardPage() {
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
    console.error("Unable to verify the dashboard session.", error);
    redirect("/login?error=session");
  }

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile, error: profileError },
    taskResult,
    attendanceResult,
    examResult,
  ] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, branch, semester")
        .eq("id", user.id)
        .maybeSingle(),
      getCurrentStudentTasks(),
      getAttendanceWorkspace(),
      getCurrentStudentExams(),
    ]);

  if (profileError) {
    console.error("Unable to load the student dashboard profile.", profileError);
  }

  const tasks = taskResult.status === "ready" ? taskResult.tasks : [];
  const urgentTasks = tasks
    .map((task) => ({ ...task, daysUntil: getDaysUntil(task.due_date) }))
    .filter((task) => task.daysUntil <= 3)
    .sort((a, b) => a.daysUntil - b.daysUntil || a.title.localeCompare(b.title));
  const attendance =
    attendanceResult.status === "ready"
      ? attendanceResult.records.reduce(
          (totals, record) => ({
            attended: totals.attended + record.attended,
            total: totals.total + record.total,
          }),
          { attended: 0, total: 0 },
        )
      : null;
  const overallAttendance =
    attendance && attendance.total > 0
      ? Math.round((attendance.attended / attendance.total) * 100)
      : null;
  const upcomingExams =
    examResult.status === "ready"
      ? examResult.exams.filter(
          (exam) => exam.exam_date >= getTodayInAppTimeZone(),
        )
      : [];
  const nextExam = upcomingExams[0];
  const nextExamDate = nextExam
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(new Date(`${nextExam.exam_date}T12:00:00Z`))
    : null;
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#737373]">
            {today}
          </p>
          <h1 className="text-[28px] font-semibold tracking-[-0.055em] text-[#171717] sm:text-[34px]">
            Good day{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-2 text-sm text-[#737373]">
            Your academic essentials, organized in one place.
          </p>
        </div>
      </section>

      <section aria-label="Academic summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Tasks"
          value={taskResult.status === "ready" ? String(tasks.length) : "—"}
          detail={taskResult.status === "ready" ? `${urgentTasks.length} due soon` : "Unavailable"}
          icon="tasks"
          href="/tasks"
        />
        <SummaryCard
          label="Upcoming exams"
          value={
            examResult.status === "ready"
              ? String(upcomingExams.length)
              : "—"
          }
          detail={
            examResult.status === "migration-required"
              ? "Apply exams migration in Supabase"
              : examResult.status !== "ready"
                ? "Exam schedule unavailable"
              : nextExam && nextExamDate
                ? `Next: ${nextExam.subject} · ${nextExamDate}`
                : "No upcoming exams"
          }
          icon="exams"
          href="/exams"
        />
        <SummaryCard
          label="Overall attendance"
          value={overallAttendance === null ? "—" : `${overallAttendance}%`}
          detail={
            attendanceResult.status === "ready"
              ? attendance?.total
                ? `${attendance.attended} of ${attendance.total} classes`
                : "No classes recorded"
              : "Attendance data unavailable"
          }
          icon="attendance"
          href="/attendance"
        />
        <SummaryCard
          label="Campus events"
          value="—"
          detail="Event listings are not connected"
          icon="events"
          href="/events"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
        <article className="rounded-[22px] border border-[#e5e5e5] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8a8a8a]">
                Your workload
              </p>
              <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.035em] text-[#171717]">
                Urgent tasks
              </h2>
            </div>
            <Link
              className="rounded-full border border-[#e5e5e5] px-3 py-1.5 text-[10px] font-semibold text-[#3b3b3b] transition hover:bg-[#f5f5f3]"
              href="/tasks"
            >
              View all
            </Link>
          </div>

          {taskResult.status === "error" ? (
            <EmptyState
              title="Tasks could not be loaded"
              description="Check your connection and refresh to try again."
            />
          ) : urgentTasks.length === 0 ? (
            <EmptyState
              title={tasks.length === 0 ? "No tasks yet" : "You're clear for now"}
              description={
                tasks.length === 0
                  ? "Add your first assignment to see deadline reminders here."
                  : "No tasks are overdue or due in the next three days."
              }
              href="/tasks"
              linkLabel="Open Task Manager"
            />
          ) : (
            <ul className="mt-4 divide-y divide-[#eeeeec]">
              {urgentTasks.slice(0, 5).map((task) => {
                const deadline =
                  task.daysUntil < 0
                    ? `${Math.abs(task.daysUntil)}d overdue`
                    : task.daysUntil === 0
                      ? "Due today"
                      : `${task.daysUntil}d left`;

                return (
                  <li className="flex items-center gap-3 py-3" key={task.id}>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f1ef] text-[#3b3b3b]">
                      <Icon className="size-4" name="tasks" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[#252525]">
                        {task.title}
                      </span>
                      <span className="mt-1 block text-[10px] text-[#858585]">
                        Due {formatDate(task.due_date)}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                        task.daysUntil <= 0
                          ? "bg-[#171717] text-white"
                          : "bg-[#eeeeec] text-[#454545]"
                      }`}
                    >
                      {deadline}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        <article className="dashboard-attendance-panel rounded-[22px] border p-5 text-white sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a3a3a3]">
                Attendance tracker
              </p>
              <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.035em]">
                Subject overview
              </h2>
            </div>
            <Link
              aria-label="Open attendance"
              className="dashboard-attendance-link flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
              href="/attendance"
            >
              <Icon className="size-4" name="attendance" />
            </Link>
          </div>

          {attendanceResult.status === "ready" && attendanceResult.records.length ? (
            <div className="mt-5">
              <div className="flex items-end justify-between">
                <p className="text-4xl font-semibold tracking-[-0.07em]">
                  {overallAttendance}%
                </p>
                <p className="pb-1 text-[10px] text-[#b8b8b8]">
                  {attendance?.attended} / {attendance?.total} classes
                </p>
              </div>
              <div className="dashboard-attendance-track mt-3 h-1.5 rounded-full">
                <div
                  className="dashboard-attendance-progress h-full rounded-full"
                  style={{ width: `${Math.min(overallAttendance ?? 0, 100)}%` }}
                />
              </div>
              <ul className="mt-5 space-y-3">
                {attendanceResult.records.slice(0, 3).map((record) => {
                  const percent =
                    record.total > 0
                      ? Math.round((record.attended / record.total) * 100)
                      : 0;
                  return (
                    <li className="flex items-center justify-between gap-3 text-xs" key={record.id}>
                      <span className="truncate text-[#d0d0d0]">{record.subject}</span>
                      <span className="font-medium text-white">{percent}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="dashboard-attendance-empty mt-5 rounded-2xl border p-4">
              <p className="text-sm font-medium text-white">
                {attendanceResult.status === "error"
                  ? "Attendance is unavailable"
                  : "No attendance recorded"}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#b8b8b8]">
                {attendanceResult.status === "error"
                  ? "Check the attendance database setup and refresh."
                  : "Subject totals will appear here once records are added."}
              </p>
            </div>
          )}
          <Link
            className="dashboard-attendance-link mt-5 inline-flex text-[10px] font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            href="/attendance"
          >
            Open attendance
          </Link>
        </article>
      </section>

      <section aria-labelledby="shortcuts-heading">
        <div className="mb-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8a8a8a]">
            Keep moving
          </p>
          <h2
            className="mt-1 text-lg font-semibold tracking-[-0.035em] text-[#171717]"
            id="shortcuts-heading"
          >
            Quick actions
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((shortcut) => (
            <Link
              className="group flex items-center gap-3 rounded-[18px] border border-[#e5e5e5] bg-white p-4 transition hover:border-[#c8c8c5] hover:shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
              href={shortcut.href}
              key={shortcut.href}
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f1ef] text-[#333]">
                <Icon className="size-[17px]" name={shortcut.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-[#222]">{shortcut.label}</span>
                <span className="mt-1 block text-[10px] text-[#858585]">{shortcut.detail}</span>
              </span>
              <span aria-hidden="true" className="text-sm text-[#999] transition group-hover:translate-x-0.5 group-hover:text-[#171717]">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {profile ? (
        <p className="border-t border-[#e5e5e5] pt-4 text-[10px] text-[#8a8a8a]">
          {profile.branch} · Semester {profile.semester}
        </p>
      ) : null}
      <RadialCommandBall />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  href,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  href: string;
  icon: "tasks" | "exams" | "attendance" | "events";
}) {
  return (
    <Link
      className="rounded-[18px] border border-[#e5e5e5] bg-white p-4 transition hover:border-[#c8c8c5] hover:shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
      href={href}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium text-[#737373]">{label}</p>
        <Icon className="size-4 text-[#777]" name={icon} />
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.06em] text-[#171717]">{value}</p>
      <p className="mt-1 truncate text-[10px] text-[#858585]">{detail}</p>
    </Link>
  );
}

function EmptyState({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-[#dededc] bg-[#fafaf9] px-4 py-8 text-center">
      <p className="text-sm font-medium text-[#303030]">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#777]">{description}</p>
      {href && linkLabel ? (
        <Link className="mt-3 inline-flex text-[10px] font-semibold text-[#222] underline underline-offset-4" href={href}>
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
