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

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!getSupabaseConfig()) {
    return { message: "Supabase is not configured yet. Add the required environment variables." };
  }

  const email = getText(formData, "email").toLowerCase();
  const password = formData.get("password");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string" || !password) {
    return { message: "Enter a valid email address and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Student sign-in failed.", error);
    return { message: "Sign-in failed. Check your email and password, then try again." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!getSupabaseConfig()) {
    return { message: "Supabase is not configured yet. Add the required environment variables." };
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
    return { message: "Enter a valid mobile number with 7 to 15 digits." };
  }

  if (branch.length < 1 || branch.length > 80) {
    return { message: "Enter a branch (up to 80 characters)." };
  }

  if (!/^\d+$/.test(semesterValue) || !Number.isSafeInteger(semester)) {
    return { message: "Semester must be a whole number from 1 to 8." };
  }

  if (semester > 8) {
    return { message: "Semester cannot be more than 8." };
  }

  if (semester < 1) {
    return { message: "Semester must be at least 1." };
  }

  if (typeof password !== "string" || password.length < 8) {
    return { message: "Password must be at least 8 characters." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, mobile_number: mobileNumber, branch, semester },
    },
  });

  if (error) {
    console.error("Student sign-up failed.", error);
    return { message: "We couldn't create the account. Check your details or try signing in." };
  }

  if (!data.session) {
    return {
      message:
        "Supabase did not start a session. Turn off email confirmation in Supabase Auth settings, then try again. If this email already has an account, sign in instead.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Student sign-out failed.", error);
    throw new Error("Unable to sign out. Please try again.");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
