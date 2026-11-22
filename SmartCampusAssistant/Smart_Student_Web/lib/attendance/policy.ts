const DEFAULT_ATTENDANCE_THRESHOLD = 75;

export function getAttendanceThreshold() {
  const configured = Number(process.env.NEXT_PUBLIC_ATTENDANCE_THRESHOLD);

  return Number.isInteger(configured) && configured >= 1 && configured <= 100
    ? configured
    : DEFAULT_ATTENDANCE_THRESHOLD;
}
