import { NextResponse } from "next/server";
import { getCampusCoreStudent } from "@/lib/campuscore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 }
    );
  }

  try {
    const student = await getCampusCoreStudent(studentId);

    return NextResponse.json({ success: true, student });
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Unknown connection error";

    console.error("CampusCore test error:", details);

    return NextResponse.json(
      { error: "Failed to connect to CampusCore", details },
      { status: 500 }
    );
  }
}