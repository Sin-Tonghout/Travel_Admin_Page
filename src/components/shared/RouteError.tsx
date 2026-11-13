import { useRouteError } from "react-router-dom";

export function RouteError() {
  const error = useRouteError();
  const message =
    error instanceof Error ? `${error.message}\n\n${error.stack ?? ""}` : typeof error === "string" ? error : "Unknown error";

  return (
    <div role="alert" className="rounded-xl border border-danger/40 bg-surface p-6">
      <h2 className="text-base font-semibold text-text-primary">This page crashed</h2>
      <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap text-xs text-text-secondary">{message}</pre>
    </div>
  );
}