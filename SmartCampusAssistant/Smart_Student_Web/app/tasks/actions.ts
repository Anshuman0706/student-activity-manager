"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { isValidCalendarDate } from "@/lib/tasks/dates";

export type CreateTaskState = {
  message: string;
  success?: boolean;
};

export async function createTaskAction(
  _previousState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  if (!getSupabaseConfig()) {
    return { message: "Supabase is not configured yet. Add the project URL and publishable key." };
  }

  const rawTitle = formData.get("title");
  const rawDueDate = formData.get("dueDate");
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  const dueDate = typeof rawDueDate === "string" ? rawDueDate : "";

  if (title.length < 1 || title.length > 99) {
    return { message: "Task title must be between 1 and 99 characters." };
  }

  if (!isValidCalendarDate(dueDate)) {
    return { message: "Enter a valid due date." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the session before creating a task.", authError);
    return { message: "We couldn't verify your sign-in. Please sign in again." };
  }

  if (!user) {
    return { message: "Sign in before adding a task." };
  }

  const { error } = await supabase.from("tasks").insert({
    student_id: user.id,
    title,
    due_date: dueDate,
  });

  if (error) {
    console.error("Unable to save the task.", error);
    return { message: "We couldn't save this task. Please try again." };
  }

  revalidatePath("/tasks");
  revalidatePath("/");
  return { message: "Task added.", success: true };
}
