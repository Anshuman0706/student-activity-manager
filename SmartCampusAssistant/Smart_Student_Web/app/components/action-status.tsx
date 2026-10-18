"use client";

import { useEffect, useState } from "react";

export function ActionStatus({
  message,
  success,
  className = "text-xs",
  successClassName = "text-[#333333]",
  errorClassName = "text-[#555555]",
}: {
  message: string;
  success?: boolean;
  className?: string;
  successClassName?: string;
  errorClassName?: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!success || !message) {
      return;
    }

    const timeout = window.setTimeout(() => setVisible(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [message, success]);

  if (!message || !visible) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className={`${className} ${success ? successClassName : errorClassName}`}
      role="status"
    >
      {message}
    </p>
  );
}
