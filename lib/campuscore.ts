import "server-only";

export async function getCampusCoreStudent(studentId: string) {
  const baseUrl = process.env.CAMPUSCORE_API_URL;
  const secret = process.env.CAMPUSCORE_API_SECRET;

 console.log("CampusCore config check:", {
  urlLoaded: !!baseUrl,
  secretLoaded: !!secret,
  url: baseUrl,
});

if (!baseUrl || !secret) {
  throw new Error("CampusCore API configuration is missing");
}

  const url = new URL("/api/students", baseUrl);
  url.searchParams.set("studentId", studentId);

  console.log("CampusCore URL:", url.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-campuscore-secret": secret,
    },
    cache: "no-store",
  });

  console.log("CampusCore response status:", response.status);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("CampusCore error:", response.status, errorBody);
    throw new Error(`CampusCore API failed: ${response.status}`);
  }

  const result = await response.json();

  return result.students?.[0] ?? null;
}