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

type CampusCoreAttendance = {
  status: string;
  date?: string;
  subject_code?: string;
  subject_name?: string;
};

async function getCampusCoreAttendance(studentId: string) {
  const baseUrl = process.env.CAMPUSCORE_API_URL;
  const secret = process.env.CAMPUSCORE_API_SECRET;

  if (!baseUrl || !secret) {
    throw new Error("CampusCore configuration is missing");
  }

  const url = new URL("/api/attendance", baseUrl);
  url.searchParams.set("studentId", studentId);

  console.log("Fetching CampusCore attendance:", url.toString());

  const response = await fetch(url.toString(), {
    headers: {
      "x-campuscore-secret": secret,
    },
    cache: "no-store",
  });

  console.log("CampusCore attendance HTTP status:", response.status);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("CampusCore attendance response:", errorBody);
    throw new Error(`CampusCore attendance failed: ${response.status}`);
  }

  const result = await response.json();

  console.log("CampusCore attendance data received:", result);

  return (result.attendance ?? []) as CampusCoreAttendance[];
}

function aggregateAttendance(
  entries: CampusCoreAttendance[],
  authUserId: string
): AttendanceRecord[] {
  const grouped = new Map<string, AttendanceRecord>();

  for (const entry of entries) {
    const subject =
      entry.subject_name || entry.subject_code || "Unknown subject";

    if (!grouped.has(subject)) {
      grouped.set(subject, {
        id: subject,
        student_id: authUserId,
        subject,
        attended: 0,
        total: 0,
        created_at: entry.date ?? new Date().toISOString(),
      });
    }

    const record = grouped.get(subject)!;

    record.total += 1;

    if (entry.status?.toLowerCase() === "present") {
      record.attended += 1;
    }
  }

  return Array.from(grouped.values()).sort((a, b) =>
    a.subject.localeCompare(b.subject)
  );
}

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

  // Admins continue using the existing SmartCampus attendance system.
  if (isAdmin) {
    const { data: studentsData, error: studentsError } = await supabase
      .from("profiles")
      .select("id, full_name, branch, semester")
      .order("full_name", { ascending: true });

    if (studentsError) {
      console.error(
        "Unable to load students for attendance management.",
        studentsError
      );
      return { status: "error" };
    }

    const { data: recordsData, error: recordsError } = await supabase
      .from("attendance")
      .select("id, student_id, subject, attended, total, created_at")
      .order("subject", { ascending: true });

    if (recordsError) {
      console.error("Unable to load admin attendance records.", recordsError);
      return { status: "error" };
    }

    return {
      status: "ready",
      records: recordsData ?? [],
      isAdmin: true,
      studentId: user.id,
      students: studentsData ?? [],

      
    };
  }

  // Derive the official student ID from the login email.
  const email = user.email ?? "";
  const suffix = "@students.smartcampus.invalid";

  console.log("SmartCampus attendance: student email =", email);

  if (!email.endsWith(suffix)) {
    console.error(
      "Student ID could not be derived. Email format does not match:",
      email
    );
    return { status: "error" };
  }

  const officialStudentId = email.slice(0, -suffix.length);

  console.log(
    "SmartCampus attendance: derived student ID =",
    officialStudentId
  );

  try {
    const attendanceData =
      await getCampusCoreAttendance(officialStudentId);

    console.log(
      "CampusCore attendance records received:",
      attendanceData
    );

    const records = aggregateAttendance(attendanceData, user.id);

    console.log("Aggregated attendance records:", records);

    return {
      status: "ready",
      records,
      isAdmin: false,
      studentId: user.id,
      students: [],
    };
  } catch (error) {
    console.error("Unable to load CampusCore attendance.");
    console.error("Attendance error details:", error);

    return { status: "error" };
  }
}