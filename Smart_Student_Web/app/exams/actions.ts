"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidCalendarDate } from "@/lib/tasks/dates";

export type CreateExamState = {
  message: string;
  success?: boolean;
};

export async function createExamAction(
  _previousState: CreateExamState,
  formData: FormData,
): Promise<CreateExamState> {
  if (!getSupabaseConfig()) {
    return {
      message: "Supabase is not configured yet. Add the project URL and publishable key.",
    };
  }

  const subjectValue = formData.get("subject");
  const examDateValue = formData.get("examDate");
  const subject = typeof subjectValue === "string" ? subjectValue.trim() : "";
  const examDate = typeof examDateValue === "string" ? examDateValue : "";

  if (subject.length < 1 || subject.length > 100) {
    return { message: "Subject name must be between 1 and 100 characters." };
  }

  if (!isValidCalendarDate(examDate)) {
    return { message: "Enter a valid exam date." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the session before creating an exam.", authError);
    return { message: "We couldn't verify your sign-in. Please sign in again." };
  }

  if (!user) {
    return { message: "Sign in before adding an exam." };
  }

  const { error } = await supabase.from("exams").insert({
    student_id: user.id,
    subject,
    exam_date: examDate,
  });

  if (error) {
    console.error("Unable to save the exam.", error);
    if (error.code === "42P01" || error.code === "PGRST205") {
      return {
        message:
          "Exam storage is not set up yet. Apply the student exams migration in Supabase, then try again.",
      };
    }

    return { message: "We couldn't save this exam. Apply the exam planner migration and try again." };
  }

  revalidatePath("/exams");
  revalidatePath("/dashboard");
  return { message: "Exam added to your planner.", success: true };
}
