import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentStudentTasks, getTaskNotifications } from "@/lib/tasks/data";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#737373]">
          Your updates
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.055em] text-[#171717] sm:text-[34px]">
          Notifications
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
          Deadline reminders are calculated from your saved tasks. They update
          when you revisit this page.
        </p>
      </header>
      <Suspense fallback={<NotificationsLoading />}>
        <NotificationsContent />
      </Suspense>
    </div>
  );
}

function NotificationsLoading() {
  return (
    <div className="rounded-[20px] border border-[#e5e5e5] bg-white p-6 text-sm text-[#737373]">
      Loading your reminders…
    </div>
  );
}

async function NotificationsContent() {
  const result = await getCurrentStudentTasks();

  if (result.status === "signed-out") {
    redirect("/login");
  }

  const reminders = result.status === "ready" ? getTaskNotifications(result.tasks) : [];

  return (
    <>
      {result.status === "error" ? (
        <section className="rounded-[20px] border border-[#e5e5e5] bg-white p-6">
          <h2 className="text-sm font-semibold text-[#171717]">Updates are unavailable</h2>
          <p className="mt-2 text-xs leading-5 text-[#737373]">
            We couldn&apos;t load your tasks to generate deadline reminders.
            Refresh the page to try again.
          </p>
        </section>
      ) : reminders.length === 0 ? (
        <section className="rounded-[20px] border border-dashed border-[#d5d5d2] bg-white px-6 py-12 text-center">
          <h2 className="text-sm font-semibold text-[#252525]">
            {result.status === "ready" ? "You’re all caught up" : "No reminders yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#777]">
            {result.status === "ready"
              ? "There are no overdue tasks or deadlines within the next three days."
              : "Task deadline reminders will appear here when task data is available."}
          </p>
          <Link
            className="mt-4 inline-flex rounded-full bg-[#080808] px-4 py-2.5 text-[10px] font-semibold text-white hover:bg-[#303030]"
            href="/tasks"
          >
            Open Task Manager
          </Link>
        </section>
      ) : (
        <section className="rounded-[20px] border border-[#e5e5e5] bg-white p-4 sm:p-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[#171717]">Task deadlines</h2>
            <span className="rounded-full bg-[#eeeeec] px-2.5 py-1 text-[9px] font-semibold text-[#444]">
              {reminders.length} {reminders.length === 1 ? "reminder" : "reminders"}
            </span>
          </div>
          <ul className="divide-y divide-[#eeeeec]">
            {reminders.map((reminder) => (
              <li className="flex items-center gap-3 py-4" key={reminder.id}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f1ef] text-[10px] font-semibold text-[#333]">
                  !
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#252525]">
                    {reminder.title}
                  </p>
                  <p className="mt-1 text-[10px] text-[#777]">
                    {reminder.label} · {reminder.detail}
                  </p>
                </div>
                <Link
                  className="shrink-0 rounded-full border border-[#e5e5e5] px-3 py-1.5 text-[9px] font-semibold text-[#333] hover:bg-[#f5f5f3]"
                  href="/tasks"
                >
                  View task
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-[#eeeeec] pt-4 text-[10px] leading-5 text-[#858585]">
            These reminders are generated from current task dates. Read status
            and persistent notification preferences are not connected yet.
          </p>
        </section>
      )}
    </>
  );
}
