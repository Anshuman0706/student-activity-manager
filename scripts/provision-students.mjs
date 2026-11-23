import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const CAMPUSCORE_URL = process.env.CAMPUSCORE_API_URL;
const CAMPUSCORE_SECRET = process.env.CAMPUSCORE_API_SECRET;
const DEFAULT_PASSWORD = "Campus@123";

async function main() {
  // Fetch all students from CampusCore
  const response = await fetch(`${CAMPUSCORE_URL}/api/students`, {
    headers: { "x-campuscore-secret": CAMPUSCORE_SECRET },
  });

  if (!response.ok) throw new Error("CampusCore fetch failed");

  const { students } = await response.json();
  console.log(`Found ${students.length} student records`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const student of students) {
    const studentId = String(student.student_id).trim();
    const email = `${studentId}@students.smartcampus.invalid`;

    try {
      // Check if account already exists
      let existingUser = null;
      let page = 1;

      while (!existingUser) {
        const { data, error } = await supabase.auth.admin.listUsers({
          page,
          perPage: 1000,
        });

        if (error) throw error;

        existingUser = data.users.find((u) => u.email === email);

        if (existingUser || data.users.length < 1000) break;
        page++;
      }

      if (existingUser) {
        console.log(`SKIP: ${studentId} already exists`);
        skipped++;
        continue;
      }

      // Create Auth account
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: student.full_name,
          student_id: studentId,
          branch: student.department_id ?? "",
          semester: student.current_semester ?? 1,
        },
      });

      if (error) throw error;

      // Ensure profile exists
      const { error: profileError } = await supabase
        .from("profiles")
      .upsert(
        {
          id: data.user.id,
          full_name: student.full_name,
          branch: String(student.department_id ?? ""),
          semester: Number(student.current_semester ?? 1),
          role: "student",
        },
        { onConflict: "id" }
      );

      if (profileError) throw profileError;

      console.log(`CREATED: ${studentId}`);
      created++;
    } catch (err) {
      console.error(`FAILED: ${studentId}`, err.message);
      failed++;
    }
  }

  console.log("\n--- PROVISIONING SUMMARY ---");
  console.log("Created:", created);
  console.log("Skipped:", skipped);
  console.log("Failed:", failed);
}

main().catch(console.error);