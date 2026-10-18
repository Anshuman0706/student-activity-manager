import Link from "next/link";
import { getCurrentStudentTasks, getTaskNotifications } from "@/lib/tasks/data";

export async function TaskDashboard() {
  const result = await getCurrentStudentTasks();

  if (result.status === "signed-out") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
        <h2 className="text-sm font-semibold text-[#252525]">Your task overview</h2>
        <p className="mt-1 text-xs leading-5 text-[#737373]">
          Sign in to see tasks and deadline alerts linked to your account.
        </p>
        <Link className="mt-3 inline-block text-xs font-semibold text-[#171717]" href="/login">
          Sign in to continue
        </Link>
      </section>
    );
  }

  if (result.status === "setup") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
        <h2 className="text-sm font-semibold text-[#252525]">Your task overview</h2>
        <p className="mt-1 text-xs leading-5 text-[#737373]">
          Configure Supabase to connect student records and deadline alerts.
        </p>
      </section>
    );
  }

  if (result.status === "error") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
        <h2 className="text-sm font-semibold text-[#444444]">Task overview unavailable</h2>
        <p className="mt-1 text-xs leading-5 text-[#555555]">
          We couldn&apos;t load your task records. Please refresh to try again.
        </p>
      </section>
    );
  }

  const alerts = getTaskNotifications(result.tasks);

  return (
    <section className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#252525]">Your task overview</h2>
          <p className="mt-1 text-xs text-[#737373]">
            {result.tasks.length} {result.tasks.length === 1 ? "task" : "tasks"} in your account
          </p>
        </div>
        <Link className="text-xs font-semibold text-[#171717]" href="/tasks">
          Open tasks
        </Link>
      </div>
      {alerts.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-[#eeeeec] pt-4">
          {alerts.map((alert) => (
            <li
              className="flex flex-wrap items-center justify-between gap-2 text-xs"
              key={alert.id}
            >
              <span className="font-medium text-[#333333]">{alert.title}</span>
              <span
                className={
                  alert.daysUntil < 0 || alert.daysUntil === 0
                    ? "font-semibold text-[#444444]"
                    : "font-semibold text-[#444444]"
                }
              >
                {alert.label} · {alert.detail}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
