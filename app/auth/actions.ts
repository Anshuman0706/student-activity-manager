"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { isValidMobileNumber } from "@/lib/phone-number";

export type AuthActionState = {
  message: string;
  success?: boolean;
};

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// Student ID → internal Auth email
function studentIdToEmail(studentId: string) {
  return `${studentId.trim().toLowerCase()}@students.smartcampus.invalid`;
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!getSupabaseConfig()) {
    return { message: "Supabase configuration is missing." };
  }

  const studentId = getText(formData, "studentId");
  const password = formData.get("password");

  if (
    !/^[a-zA-Z0-9._-]{2,50}$/.test(studentId) ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return { message: "Enter a valid Student ID and password." };
  }

  const supabase = await createSupabaseServerClient();

  const email = studentIdToEmail(studentId);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.error("Student login error:", error?.message);

    return {
      message: "Invalid Student ID or password.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!getSupabaseConfig()) {
    return { message: "Supabase configuration is missing." };
  }

  const fullName = getText(formData, "fullName");
  const email = getText(formData, "email").toLowerCase();
  const mobileNumber = getText(formData, "mobileNumber");
  const branch = getText(formData, "branch");
  const semesterValue = getText(formData, "semester");
  const password = formData.get("password");
  const semester = Number(semesterValue);

  if (fullName.length < 2 || fullName.length > 100) {
    return { message: "Name must be between 2 and 100 characters." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { message: "Enter a valid email address." };
  }

  if (!isValidMobileNumber(mobileNumber)) {
    return { message: "Enter a valid mobile number." };
  }

  if (branch.length < 1 || branch.length > 80) {
    return { message: "Enter a valid branch." };
  }

  if (!/^\d+$/.test(semesterValue) || !Number.isSafeInteger(semester)) {
    return { message: "Enter a valid semester." };
  }

  if (semester < 1 || semester > 8) {
    return { message: "Semester must be between 1 and 8." };
  }

  if (typeof password !== "string" || password.length < 8) {
    return { message: "Password must be at least 8 characters." };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        mobile_number: mobileNumber,
        branch,
        semester,
      },
    },
  });

  if (error) {
    console.error("Student signup error:", error.message);

    return {
      message: "Unable to create account. Please try again.",
    };
  }

  if (!data.session) {
    return {
      message:
        "Account created, but email confirmation is required. Please check your email.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign-out error:", error.message);
    throw new Error("Unable to sign out.");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}