export type DeadlinePriority = "HIGH" | "MEDIUM" | "LOW";

export function getDeadlinePriority(daysRemaining: number): DeadlinePriority {
  if (daysRemaining <= 1) {
    return "HIGH";
  }

  if (daysRemaining <= 5) {
    return "MEDIUM";
  }

  return "LOW";
}
