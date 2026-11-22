"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionStatus } from "@/app/components/action-status";
import {
  createTaskAction,
  type CreateTaskState,
} from "@/app/tasks/actions";

const initialState: CreateTaskState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="min-h-11 rounded-xl bg-[#080808] px-5 text-xs font-semibold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Adding task…" : "Add task"}
    </button>
  );
}

export function TaskForm() {
  const [state, formAction] = useActionState(createTaskAction, initialState);

  return (
    <form
      action={formAction}
      className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_auto] sm:items-end"
    >
      <label className="block" htmlFor="task-title">
        <span className="mb-1.5 block text-xs font-semibold text-[#555555]">Task title</span>
        <input
          className="min-h-11 w-full rounded-xl border border-[#e5e5e5] bg-[#ffffff] px-3.5 text-sm text-[#171717] outline-none transition placeholder:text-[#999999] focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
          id="task-title"
          maxLength={99}
          name="title"
          placeholder="e.g. DSA assignment"
          required
        />
      </label>
      <label className="block" htmlFor="task-due-date">
        <span className="mb-1.5 block text-xs font-semibold text-[#555555]">Due date</span>
        <input
          className="min-h-11 w-full rounded-xl border border-[#e5e5e5] bg-[#ffffff] px-3.5 text-sm text-[#171717] outline-none transition focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
          id="task-due-date"
          name="dueDate"
          required
          type="date"
        />
      </label>
      <SubmitButton />
      <ActionStatus
        className="text-xs sm:col-span-3"
        message={state.message}
        success={state.success}
      />
    </form>
  );
}
