"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidCalendarDate } from "@/lib/tasks/dates";

export type LibraryActionState = {
  message: string;
  success?: boolean;
};

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function addBorrowedBookAction(
  _previousState: LibraryActionState,
  formData: FormData,
): Promise<LibraryActionState> {
  if (!getSupabaseConfig()) {
    return { message: "Supabase is not configured yet." };
  }

  const bookName = getText(formData, "bookName");
  const borrowedOn = getText(formData, "borrowedOn");
  const returnBy = getText(formData, "returnBy");

  if (bookName.length < 1 || bookName.length > 200) {
    return { message: "Book name must be between 1 and 200 characters." };
  }

  if (!isValidCalendarDate(borrowedOn)) {
    return { message: "Enter a valid borrow date." };
  }

  if (!isValidCalendarDate(returnBy)) {
    return { message: "Enter a valid expected submission date." };
  }

  if (returnBy < borrowedOn) {
    return {
      message: "Expected submission date cannot be before the borrow date.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the library action session.", authError);
    return { message: "We couldn't verify your sign-in. Please sign in again." };
  }

  if (!user) {
    return { message: "Sign in before adding a borrowed book." };
  }

  const { error } = await supabase.from("student_library_loans").insert({
    student_id: user.id,
    book_name: bookName,
    borrowed_on: borrowedOn,
    return_by: returnBy,
  });

  if (error) {
    console.error("Unable to save the borrowed book.", error);
    return { message: "We couldn't save this book. Please try again." };
  }

  revalidatePath("/library");
  return { message: "Borrowed book added to your list.", success: true };
}
