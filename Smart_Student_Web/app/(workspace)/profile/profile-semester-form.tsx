"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionStatus } from "@/app/components/action-status";
import {
  updateProfileSemesterAction,
  type ProfileActionState,
} from "./actions";

const initialState: ProfileActionState = { message: "" };

function SaveButton() {
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

export function ProfileSemesterForm({ semester }: { semester: number }) {
  const [state, formAction] = useActionState(
    updateProfileSemesterAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor="profile-semester">
        Semester (1–8)
      </label>
      <select
        className="min-h-10 rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm font-semibold text-[#252525] outline-none focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
        defaultValue={semester}
        id="profile-semester"
        name="semester"
      >
        {Array.from({ length: 8 }, (_, index) => index + 1).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <SaveButton />
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
