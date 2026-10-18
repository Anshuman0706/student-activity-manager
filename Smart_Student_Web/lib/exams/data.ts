import "server-only";

import { connection } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StudentExam = {
  id: string;
  subject: string;
  exam_date: string;
};

export type ExamDataResult =
  | { status: "setup" }
  | { status: "migration-required" }
  | { status: "signed-out" }
  | { status: "error" }
  | { status: "ready"; exams: StudentExam[] };

function isMissingExamsTableError(code: string) {
  return code === "42P01" || code === "PGRST205";
}

export async function getCurrentStudentExams(): Promise<ExamDataResult> {
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
    console.error("Unable to verify the current student session for exams.", authError);
    return { status: "error" };
  }

  if (!user) {
    return { status: "signed-out" };
  }

  const { data, error } = await supabase
    .from("exams")
    .select("id, subject, exam_date")
    .eq("student_id", user.id)
    .order("exam_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingExamsTableError(error.code)) {
      return { status: "migration-required" };
    }

    console.error("Unable to load the current student's exams.", error);
    return { status: "error" };
  }

  return { status: "ready", exams: data };
}
