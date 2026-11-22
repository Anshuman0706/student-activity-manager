"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidMobileNumber } from "@/lib/phone-number";

export type ProfileActionState = {
  message: string;
  success?: boolean;
};

export async function updateProfileSemesterAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const semesterValue = formData.get("semester");
  const semester =
    typeof semesterValue === "string" && /^\d+$/.test(semesterValue)
      ? Number(semesterValue)
      : NaN;

  if (!Number.isSafeInteger(semester) || semester < 1 || semester > 8) {
    return { message: "Choose a semester from 1 to 8." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the profile update session.", authError);
    return { message: "We couldn't verify your account. Please sign in again." };
  }

  if (!user) {
    return { message: "Please sign in to update your semester." };
  }

  const { data: updated, error } = await supabase.rpc(
    "update_own_profile_semester",
    { p_semester: semester },
  );

  if (error) {
    console.error("Unable to update the student semester.", error);
    if (error.code === "42883" || error.code === "PGRST202") {
      return {
        message:
          "Semester saving is not enabled in the database yet. Apply the latest Supabase migration, then try again.",
      };
    }

    return { message: "We couldn't update your semester. Please try again." };
  }

  if (!updated) {
    return {
      message:
        "Your student profile could not be found for this account.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/attendance");

  return { message: "Semester updated.", success: true };
}

export async function updateProfileMobileNumberAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const mobileNumberValue = formData.get("mobileNumber");
  const mobileNumber =
    typeof mobileNumberValue === "string" ? mobileNumberValue.trim() : "";

  if (!isValidMobileNumber(mobileNumber)) {
    return { message: "Enter a valid mobile number with 7 to 15 digits." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify the profile update session.", authError);
    return { message: "We couldn't verify your account. Please sign in again." };
  }

  if (!user) {
    return { message: "Please sign in to update your mobile number." };
  }

  const { data: updated, error } = await supabase.rpc(
    "update_own_profile_mobile_number",
    { p_mobile_number: mobileNumber },
  );

  if (error) {
    console.error("Unable to update the student mobile number.", error);
    if (error.code === "42883" || error.code === "PGRST202") {
      return {
        message:
          "Mobile number saving is not enabled yet. Apply the latest Supabase migration, then try again.",
      };
    }

    return { message: "We couldn't update your mobile number. Please try again." };
  }

  if (!updated) {
    return { message: "Your student profile could not be found for this account." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { message: "Mobile number updated.", success: true };
}
