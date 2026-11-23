import "server-only";

import { connection } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StudentLibraryLoan = {
  id: string;
  book_name: string;
  borrowed_on: string;
  return_by: string;
};

export type LibraryWorkspace =
  | { status: "setup" }
  | { status: "signed-out" }
  | { status: "error" }
  | { status: "ready"; loans: StudentLibraryLoan[] };

export async function getLibraryWorkspace(): Promise<LibraryWorkspace> {
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
    console.error("Unable to verify the library session.", authError);
    return { status: "error" };
  }

  if (!user) {
    return { status: "signed-out" };
  }

  const { data: loans, error } = await supabase
    .from("student_library_loans")
    .select("id, book_name, borrowed_on, return_by")
    .eq("student_id", user.id)
    .order("return_by", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      `Unable to load the student's borrowed books (${error.code}): ${error.message}`,
    );
    return { status: "error" };
  }

  return { status: "ready", loans };
}
