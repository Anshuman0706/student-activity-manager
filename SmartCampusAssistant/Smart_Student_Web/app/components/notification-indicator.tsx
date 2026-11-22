import { getCurrentStudentTasks, getTaskNotifications } from "@/lib/tasks/data";

export async function NotificationIndicator() {
  const result = await getCurrentStudentTasks();
  const hasNotifications =
    result.status === "ready" && getTaskNotifications(result.tasks).length > 0;

  if (!hasNotifications) {
    return null;
  }

  return (
    <span
      aria-label="You have task deadline reminders"
      className="absolute right-0.5 top-0.5 size-2.5 rounded-full border-2 border-white bg-[#c2413b]"
      role="status"
    />
  );
}
