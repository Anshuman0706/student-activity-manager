import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.CAMPUSCORE_API_URL;
  const secret = process.env.CAMPUSCORE_API_SECRET;

  if (!baseUrl || !secret) {
    return NextResponse.json(
      { error: "CampusCore configuration missing" },
      { status: 500 }
    );
  }

  try {
    const url = new URL("/api/attendance", baseUrl);
    url.searchParams.set("studentId", studentId);

    const response = await fetch(url.toString(), {
      headers: {
        "x-campuscore-secret": secret,
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("SmartCampus attendance proxy error:", error);

    return NextResponse.json(
      { error: "Unable to connect to CampusCore" },
      { status: 500 }
    );
  }
}