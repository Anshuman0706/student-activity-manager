"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionStatus } from "@/app/components/action-status";
import {
  updateProfileMobileNumberAction,
  type ProfileActionState,
} from "./actions";

const initialState: ProfileActionState = { message: "" };

function SaveMobileNumberButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="min-h-10 rounded-lg bg-[#080808] px-4 text-xs font-semibold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function ProfileMobileNumberForm({
  mobileNumber,
}: {
  mobileNumber: string;
}) {
  const [state, formAction] = useActionState(
    updateProfileMobileNumberAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor="profile-mobile-number">
        Mobile number
      </label>
      <input
        autoComplete="tel"
        className="min-h-10 w-full max-w-64 rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm font-semibold text-[#252525] outline-none focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
        id="profile-mobile-number"
        maxLength={20}
        name="mobileNumber"
        required
        type="tel"
        defaultValue={mobileNumber}
      />
      <SaveMobileNumberButton />
      <ActionStatus
        className="basis-full text-xs"
        errorClassName="text-[#7a3030]"
        message={state.message}
        success={state.success}
        successClassName="text-[#555555]"
      />
    </form>
  );
}
