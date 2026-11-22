import { Suspense, type ReactNode } from "react";
import { WorkspaceGuard } from "./workspace-guard";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-5 py-12 text-sm text-[#737373]">
          Checking student session…
        </main>
      }
    >
      <WorkspaceGuard>{children}</WorkspaceGuard>
    </Suspense>
  );
}
