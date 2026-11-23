import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDeadlinePriority } from "@/lib/deadline-priority";
import { getCurrentStudentTasks } from "@/lib/tasks/data";
import { getDaysUntil } from "@/lib/tasks/dates";
import { TaskForm } from "@/app/tasks/ui/task-form";

export default function TasksPage() {
  return (
    <div className="space-y-7">
      <header>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#737373]">
          Study workspace
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.045em] text-[#171717] sm:text-[34px]">
          Tasks & assignments
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
          Keep due dates and priorities together. Deadlines are evaluated using
          the Asia/Kolkata calendar date.
        </p>
      </header>
      <Suspense fallback={<TasksLoading />}>
        <TasksContent />
      </Suspense>
    </div>
  );
}

function TasksLoading() {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 text-sm text-[#737373]">
      Loading your tasks…
    </div>
  );
}

async function TasksContent() {
  const result = await getCurrentStudentTasks();

  if (result.status === "signed-out") {
    redirect("/login");
  }

  if (result.status === "setup") {
    return (
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
        <h2 className="font-semibold text-[#252525]">Connect your Supabase project</h2>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Add the project URL and publishable key to <code>.env.local</code>, then
          apply the profile and task migration in the Supabase SQL editor.
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
        <h2 className="font-semibold text-[#444444]">Tasks are unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-[#555555]">
          We couldn&apos;t load your student records. Check the Supabase connection
          and policies, then refresh this page.
        </p>
      </section>
    );
  }

  const { tasks } = result;

  return (
    <>
      <section
        className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6"
        id="add-task"
      >
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#252525]">Add a task</h2>
          <p className="mt-1 text-xs leading-5 text-[#737373]">
            A priority is calculated from its due date, as in the original planner.
          </p>
        </div>
        <TaskForm />
      </section>

      <section aria-labelledby="task-list-heading">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2
              className="text-base font-semibold text-[#252525]"
              id="task-list-heading"
            >
              Your task list
            </h2>
            <p className="mt-1 text-xs text-[#737373]">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} in your account
            </p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dededb] bg-white px-6 py-10 text-center">
            <p className="text-sm font-semibold text-[#333333]">No tasks yet</p>
            <p className="mt-1 text-xs leading-5 text-[#737373]">
              Add an assignment above and it will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
            <div className="hidden grid-cols-[minmax(0,1fr)_150px_120px_110px] gap-4 border-b border-[#eeeeec] bg-[#fafaf9] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#858585] sm:grid">
              <span>Task</span>
              <span>Due date</span>
              <span>Days left</span>
              <span>Priority</span>
            </div>
            <ul className="divide-y divide-[#eeeeec]">
              {tasks.map((task) => {
                const daysUntil = getDaysUntil(task.due_date);
                const priority = getDeadlinePriority(daysUntil);
                const dueDate = task.due_date.split("-").reverse().join("/");
                const priorityStyles = {
                  HIGH: "bg-[#eeeeec] text-[#444444]",
                  MEDIUM: "bg-[#eeeeec] text-[#444444]",
                  LOW: "bg-[#eeeeec] text-[#333333]",
                }[priority];

                return (
                  <li
                    className="grid gap-2 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_150px_120px_110px] sm:items-center sm:gap-4"
                    key={task.id}
                  >
                    <span className="text-sm font-semibold text-[#252525]">{task.title}</span>
                    <span className="text-xs text-[#737373]">
                      <span className="sm:hidden">Due </span>
                      {dueDate}
                    </span>
                    <span className="text-xs text-[#737373]">
                      {daysUntil < 0
                        ? `${Math.abs(daysUntil)} day(s) overdue`
                        : daysUntil === 0
                          ? "Today"
                          : `${daysUntil} day(s)`}
                    </span>
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-bold tracking-[0.08em] ${priorityStyles}`}
                    >
                      {priority}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
