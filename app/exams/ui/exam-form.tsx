"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionStatus } from "@/app/components/action-status";
import { createExamAction, type CreateExamState } from "@/app/exams/actions";

const initialState: CreateExamState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="min-h-11 rounded-xl bg-[#080808] px-5 text-xs font-semibold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving exam…" : "Add exam"}
    </button>
  );
}

export function ExamForm() {
  const [state, formAction] = useActionState(createExamAction, initialState);

  return (
    <form
      action={formAction}
      className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_auto] sm:items-end"
    >
      <label className="block" htmlFor="exam-subject">
        <span className="mb-1.5 block text-xs font-semibold text-[#555555]">
          Subject name
        </span>
        <input
          className="min-h-11 w-full rounded-xl border border-[#e5e5e5] bg-[#ffffff] px-3.5 text-sm text-[#171717] outline-none transition placeholder:text-[#999999] focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
          id="exam-subject"
          maxLength={100}
          name="subject"
          placeholder="e.g. Data Structures"
          required
        />
      </label>
      <label className="block" htmlFor="exam-date">
        <span className="mb-1.5 block text-xs font-semibold text-[#555555]">
          Exam date
        </span>
        <input
          className="min-h-11 w-full rounded-xl border border-[#e5e5e5] bg-[#ffffff] px-3.5 text-sm text-[#171717] outline-none transition focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
          id="exam-date"
          name="examDate"
          required
          type="date"
        />
      </label>
      <SubmitButton />
      <ActionStatus
        className="text-xs sm:col-span-3"
        errorClassName="text-[#7a3030]"
        message={state.message}
        success={state.success}
      />
    </form>
  );
}
