"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionStatus } from "@/app/components/action-status";
import {
  addBorrowedBookAction,
  type LibraryActionState,
} from "@/app/library/actions";
import type { StudentLibraryLoan } from "@/lib/library/data";

const initialState: LibraryActionState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="min-h-11 rounded-xl bg-[#080808] px-5 text-xs font-semibold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving…" : "Add borrowed book"}
    </button>
  );
}

function ActionMessage({ state }: { state: LibraryActionState }) {
  return <ActionStatus message={state.message} success={state.success} />;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function LibraryManager({ loans }: { loans: StudentLibraryLoan[] }) {
  const [state, action] = useActionState(addBorrowedBookAction, initialState);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#252525]">
            Record a borrowed book
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#737373]">
            Enter the book you borrowed in person from your college library and
            when it must be submitted back.
          </p>
        </div>
        <form action={action} className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-[#555555]">
              Book name
            </span>
            <input
              autoComplete="off"
              className="min-h-11 w-full rounded-xl border border-[#e5e5e5] bg-[#ffffff] px-3.5 text-sm text-[#171717] outline-none focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
              maxLength={200}
              name="bookName"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#555555]">
              Date borrowed
            </span>
            <input
              className="min-h-11 w-full rounded-xl border border-[#e5e5e5] bg-[#ffffff] px-3.5 text-sm text-[#171717] outline-none focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
              name="borrowedOn"
              required
              type="date"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#555555]">
              Date to submit
            </span>
            <input
              className="min-h-11 w-full rounded-xl border border-[#e5e5e5] bg-[#ffffff] px-3.5 text-sm text-[#171717] outline-none focus:border-[#555555] focus:ring-4 focus:ring-[#eeeeec]"
              name="returnBy"
              required
              type="date"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <SubmitButton />
            <ActionMessage state={state} />
          </div>
        </form>
      </section>

      <section aria-labelledby="borrowed-books-heading">
        <div className="mb-4">
          <h2
            className="text-base font-semibold text-[#252525]"
            id="borrowed-books-heading"
          >
            My borrowed books
          </h2>
          <p className="mt-1 text-xs text-[#737373]">
            {loans.length} {loans.length === 1 ? "book" : "books"} recorded
          </p>
        </div>

        {loans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dededb] bg-white px-6 py-10 text-center">
            <p className="text-sm font-semibold text-[#333333]">
              No borrowed books recorded
            </p>
            <p className="mt-1 text-xs leading-5 text-[#737373]">
              Add a book you borrowed and its submission date to keep track of it.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
            <ul className="divide-y divide-[#eeeeec]">
              {loans.map((loan) => (
                <li
                  className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_150px_170px] sm:items-center sm:gap-4"
                  key={loan.id}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#252525]">
                      {loan.book_name}
                    </p>
                  </div>
                  <p className="text-xs text-[#737373]">
                    <span className="font-medium text-[#858585] sm:hidden">
                      Borrowed:{" "}
                    </span>
                    <span className="hidden font-medium text-[#858585] sm:inline">
                      Borrowed{" "}
                    </span>
                    {formatDate(loan.borrowed_on)}
                  </p>
                  <p className="text-xs text-[#737373]">
                    <span className="font-medium text-[#858585] sm:hidden">
                      Submit by:{" "}
                    </span>
                    <span className="hidden font-medium text-[#858585] sm:inline">
                      Submit by{" "}
                    </span>
                    {formatDate(loan.return_by)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
