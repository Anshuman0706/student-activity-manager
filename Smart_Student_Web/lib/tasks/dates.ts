export const APP_TIME_ZONE = "Asia/Kolkata";

export function getTodayInAppTimeZone(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to determine today's date.");
  }

  return `${year}-${month}-${day}`;
}

export function isValidCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function dateToUtcMilliseconds(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
}

export function getDaysUntil(dueDate: string, today = getTodayInAppTimeZone()) {
  return Math.round(
    (dateToUtcMilliseconds(dueDate) - dateToUtcMilliseconds(today)) /
      86_400_000,
  );
}

export function getTaskAlert(daysUntil: number) {
  if (daysUntil < 0) {
    return { label: "Overdue", detail: `${Math.abs(daysUntil)} day(s) overdue` };
  }

  if (daysUntil === 0) {
    return { label: "Due today", detail: "Deadline is today" };
  }

  if (daysUntil <= 3) {
    return { label: "Upcoming", detail: `Due in ${daysUntil} day(s)` };
  }

  return null;
}
