import "server-only";

import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getDaysUntil, getTaskAlert } from "./dates";

export type StudentTask = {
  id: string;
  title: string;
  due_date: string;
};

export type TaskDataResult =
  | { status: "setup" }
  | { status: "signed-out" }
  | { status: "error" }
  | { status: "ready"; tasks: StudentTask[] };

export async function getCurrentStudentTasks(): Promise<TaskDataResult> {
  await connection();

  if (!getSupabaseConfig()) {
    return { status: "setup" };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the current student session.", authError);
    return { status: "error" };
  }

  if (!user) {
    return { status: "signed-out" };
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, due_date")
    .eq("student_id", user.id)
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Unable to load the current student's tasks.", error);
    return { status: "error" };
  }

  return { status: "ready", tasks: data };
}

export function getTaskNotifications(tasks: StudentTask[]) {
  return tasks.flatMap((task) => {
    const daysUntil = getDaysUntil(task.due_date);
    const alert = getTaskAlert(daysUntil);

    return alert
      ? [{ ...task, ...alert, daysUntil }]
      : [];
  });
}
