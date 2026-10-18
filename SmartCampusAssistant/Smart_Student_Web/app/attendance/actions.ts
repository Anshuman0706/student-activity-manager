"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AttendanceActionState = {
  message: string;
  success?: boolean;
};

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getCounts(formData: FormData) {
  const attendedValue = getText(formData, "attended");
  const totalValue = getText(formData, "total");
  const attended = Number(attendedValue);
  const total = Number(totalValue);

  if (
    !/^\d+$/.test(attendedValue) ||
    !/^\d+$/.test(totalValue) ||
    !Number.isSafeInteger(attended) ||
    !Number.isSafeInteger(total) ||
    attended > total ||
    total > 2_147_483_647
  ) {
    return null;
  }

  return { attended, total };
}

export async function createAttendanceAction(
  _previousState: AttendanceActionState,
  formData: FormData,
): Promise<AttendanceActionState> {
  if (!getSupabaseConfig()) {
    return { message: "Supabase is not configured. Add the project URL and publishable key." };
  }

  const subject = getText(formData, "subject");
  const requestedStudentId = getText(formData, "studentId");
  const counts = getCounts(formData);

  if (subject.length < 1 || subject.length > 100) {
    return { message: "Subject must be between 1 and 100 characters." };
  }

  if (!counts) {
    return { message: "Enter whole class counts, with attended classes no greater than total." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the session before creating attendance.", authError);
    return { message: "We couldn't verify your sign-in. Please sign in again." };
  }

  if (!user) {
    return { message: "Sign in before managing attendance." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Unable to verify the attendance account role.", profileError);
    return { message: "We couldn't verify your account permissions." };
  }

  const studentId =
    profile?.role === "admin" && requestedStudentId
      ? requestedStudentId
      : user.id;

  const { error } = await supabase.from("attendance").insert({
    student_id: studentId,
    subject,
    attended: counts.attended,
    total: counts.total,
  });

  if (error) {
    console.error("Unable to save the attendance record.", error);
    return {
      message:
        error.code === "23505"
          ? "An attendance record already exists for this student and subject."
          : "We couldn't save this attendance record. Check your permissions and try again.",
    };
  }

  revalidatePath("/attendance");
  revalidatePath("/dashboard");
  return { message: "Attendance record added.", success: true };
}

export async function updateAttendanceAction(
  _previousState: AttendanceActionState,
  formData: FormData,
): Promise<AttendanceActionState> {
  if (!getSupabaseConfig()) {
    return { message: "Supabase is not configured. Add the project URL and publishable key." };
  }

  const id = getText(formData, "id");
  const counts = getCounts(formData);

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { message: "Select a valid attendance record." };
  }

  if (!counts) {
    return { message: "Enter whole class counts, with attended classes no greater than total." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the session before updating attendance.", authError);
    return { message: "We couldn't verify your sign-in. Please sign in again." };
  }

  if (!user) {
    return { message: "Sign in before managing attendance." };
  }

  const { data, error } = await supabase
    .from("attendance")
    .update({ attended: counts.attended, total: counts.total })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Unable to update the attendance record.", error);
    return { message: "We couldn't update this attendance record. Please try again." };
  }

  if (!data) {
    return { message: "Attendance record not found or you don't have permission to update it." };
  }

  revalidatePath("/attendance");
  revalidatePath("/dashboard");
  return { message: "Attendance updated.", success: true };
}
