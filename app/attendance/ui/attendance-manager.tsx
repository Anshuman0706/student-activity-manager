"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ActionStatus } from "@/app/components/action-status";
import {
  createAttendanceAction,
  updateAttendanceAction,
  type AttendanceActionState,
} from "@/app/attendance/actions";
import type {
  AttendanceRecord,
  AttendanceStudent,
} from "@/lib/attendance/data";

const initialState: AttendanceActionState = { message: "" };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="min-h-10 rounded-full bg-[#080808] px-4 text-[10px] font-semibold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function ActionMessage({ state }: { state: AttendanceActionState }) {
  return (
    <ActionStatus
      className="text-[10px] leading-5"
      message={state.message}
      success={state.success}
    />
  );
}

function NumberField({
  id,
  label,
  defaultValue,
}: {
  id: string;
  label: string;
  defaultValue?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-medium text-[#555]">
        {label}
      </span>
      <input
        className="min-h-10 w-full rounded-xl border border-[#dededc] bg-white px-3 text-xs text-[#171717] outline-none transition focus:border-[#777] focus:ring-4 focus:ring-[#eeeeec]"
        defaultValue={defaultValue}
        min={0}
        name={id}
        required
        type="number"
      />
    </label>
  );
}

export function AttendanceManager({
  records,
  isAdmin,
  studentId,
  students,
  threshold,
}: {
  records: AttendanceRecord[];
  isAdmin: boolean;
  studentId: string;
  students: AttendanceStudent[];
  threshold: number;
}) {
  const [createState, createAction] = useActionState(
    createAttendanceAction,
    initialState
  );

  const studentNames = new Map(
    students.map((student) => [student.id, student.full_name])
  );

  const totals = records.reduce(
    (result, record) => ({
      attended: result.attended + record.attended,
      total: result.total + record.total,
    }),
    { attended: 0, total: 0 }
  );

  const overall =
    totals.total > 0
      ? Math.round((totals.attended / totals.total) * 100)
      : null;

  return (
    <div className="space-y-5">
      {/* Attendance summary */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Summary
          label="Overall attendance"
          value={overall === null ? "—" : `${overall}%`}
        />
        <Summary label="Classes attended" value={String(totals.attended)} />
        <Summary label="Classes held" value={String(totals.total)} />
      </section>

      {/* Admin-only attendance entry */}
      {isAdmin && (
        <section className="rounded-[20px] border border-[#e5e5e5 bg-white p-5 sm:p-6">
          <div className="mb-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#858585]">
              Administration
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-[#171717]">
              Add attendance record
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-[#777]">
              Keep totals current; attended classes cannot exceed classes held.
            </p>
          </div>

          <form
            action={createAction}
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-medium text-[#555]">
                Student
              </span>

              <select
                className="min-h-10 w-full rounded-xl border border-[#dededc] bg-white px-3 text-xs text-[#171717] outline-none focus:border-[#777] focus:ring-4 focus:ring-[#eeeeec]"
                defaultValue={studentId}
                name="studentId"
                required
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} · {student.branch}, Sem {student.semester}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-medium text-[#555]">
                Subject
              </span>

              <input
                className="min-h-10 w-full rounded-xl border border-[#dededc] bg-white px-3 text-xs text-[#171717] outline-none placeholder:text-[#aaa] focus:border-[#777] focus:ring-4 focus:ring-[#eeeeec]"
                maxLength={100}
                name="subject"
                placeholder="e.g. Data Structures"
                required
              />
            </label>

            <NumberField id="attended" label="Classes attended" />
            <NumberField id="total" label="Total classes held" />

            <div className="flex items-end">
              <SubmitButton label="Add subject" />
            </div>

            <div className="sm:col-span-2 xl:col-span-4">
              <ActionMessage state={createState} />
            </div>
          </form>
        </section>
      )}

      {/* Attendance cards */}
      <section className="rounded-[20px] border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#858585]">
              Subject performance
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-[#171717]">
              {isAdmin ? "Student attendance" : "Your subjects"}
            </h2>
          </div>

          <span className="text-[10px] text-[#777]">
            Configured minimum: {threshold}%
          </span>
        </div>

        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dededc] bg-[#fafaf9] px-5 py-9 text-center">
            <p className="text-sm font-medium text-[#333]">
              No attendance records yet
            </p>

            <p className="mt-1 text-xs leading-5 text-[#777]">
              {isAdmin
                ? "Add your first subject above to start tracking attendance."
                : "Your attendance records will appear here once they're available in CampusCore."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {records.map((record) => (
              <AttendanceCard
                key={record.id}
                record={record}
                studentName={studentNames.get(record.student_id)}
                threshold={threshold}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#e5e5e5 bg-white p-4">
      <p className="text-[10px] font-medium text-[#777]">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.06em] text-[#171717]">
        {value}
      </p>
    </div>
  );
}

function AttendanceCard({
  record,
  studentName,
  threshold,
  isAdmin,
}: {
  record: AttendanceRecord;
  studentName?: string;
  threshold: number;
  isAdmin: boolean;
}) {
  const [state, updateAction] = useActionState(
    updateAttendanceAction,
    initialState
  );

  const rawPercent =
    record.total > 0 ? (record.attended / record.total) * 100 : 0;

  const percent = Math.round(rawPercent);
  const aboveThreshold = rawPercent >= threshold;

  const classesNeeded =
    threshold < 100
      ? Math.max(
          0,
          Math.ceil(
            (threshold * record.total - 100 * record.attended) /
              (100 - threshold)
          )
        )
      : null;

  return (
    <article className="rounded-[18px] border border-[#e5e5e5 bg-[#fafaf9] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#252525]">
            {record.subject}
          </h3>

          {studentName ? (
            <p className="mt-1 truncate text-[9px] text-[#777]">
              {studentName}
            </p>
          ) : null}
        </div>

        <span className="rounded-full bg-[#eeeeec] px-2 py-1 text-[9px] font-semibold text-[#333]">
          {aboveThreshold ? "On track" : "Below target"}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <p className="text-2xl font-semibold tracking-[-0.06em] text-[#171717]">
          {percent}%
        </p>

        <p className="pb-1 text-[10px] text-[#777]">
          {record.attended} / {record.total} classes
        </p>
      </div>

      <div
        aria-label={`${percent}% attendance`}
        className="mt-3 h-1.5 rounded-full bg-[#e5e5e5]"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div
          className="h-full rounded-full bg-[#171717]"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      {!aboveThreshold && record.total > 0 ? (
        <p className="mt-2 text-[9px] leading-4 text-[#737373]">
          {classesNeeded === null
            ? "A 100% target cannot be reached by attending future classes after an absence."
            : `Attend ${classesNeeded} consecutive classes to reach ${threshold}%.`}
        </p>
      ) : null}

      {/* Admin-only update form */}
      {isAdmin && (
        <form
          action={updateAction}
          className="mt-4 border-t border-[#e5e5e5 pt-3"
        >
          <input name="id" type="hidden" value={record.id} />

          <div className="grid grid-cols-2 gap-2">
            <NumberField
              defaultValue={record.attended}
              id="attended"
              label="Attended"
            />

            <NumberField
              defaultValue={record.total}
              id="total"
              label="Total"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <ActionMessage state={state} />
            <SubmitButton label="Update totals" />
          </div>
        </form>
      )}
    </article>
  );
}