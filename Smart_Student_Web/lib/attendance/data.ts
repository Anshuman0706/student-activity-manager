import "server-only";

import { connection } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AttendanceRecord = {
  id: string;
  student_id: string;
  subject: string;
  attended: number;
  total: number;
  created_at: string;
};

export type AttendanceStudent = {
  id: string;
  full_name: string;
  branch: string;
  semester: number;
};

export type AttendanceWorkspace =
  | { status: "setup" }
  | { status: "signed-out" }
  | { status: "error" }
  | {
      status: "ready";
      records: AttendanceRecord[];
      isAdmin: boolean;
      studentId: string;
      students: AttendanceStudent[];
    };

export async function getAttendanceWorkspace(): Promise<AttendanceWorkspace> {
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
    console.error("Unable to verify the attendance session.", authError);
    return { status: "error" };
  }

  if (!user) {
    return { status: "signed-out" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Unable to load the attendance account role.", profileError);
    return { status: "error" };
  }

  const isAdmin = profile?.role === "admin";
  let students: AttendanceStudent[] = [];

  if (isAdmin) {
    const { data, error: studentsError } = await supabase
      .from("profiles")
      .select("id, full_name, branch, semester")
      .order("full_name", { ascending: true });

    if (studentsError) {
      console.error("Unable to load students for attendance management.", studentsError);
      return { status: "error" };
    }

    students = data ?? [];
  }

  const query = supabase
    .from("attendance")
    .select("id, student_id, subject, attended, total, created_at")
    .order("subject", { ascending: true });

  const { data, error } = isAdmin
    ? await query
    : await query.eq("student_id", user.id);

  if (error) {
    console.error(`Unable to load attendance records (${error.code}): ${error.message}`);
    return { status: "error" };
  }

  return {
    status: "ready",
    records: data ?? [],
    isAdmin,
    studentId: user.id,
    students,
  };
}
