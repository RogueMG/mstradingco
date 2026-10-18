import { AlertTriangle, ArrowUpRight, RotateCw, SearchX } from "lucide-react";
import { Link } from "react-router";

interface ContentStateProps {
  kind: "error" | "not-found" | "empty";
  title: string;
  message: string;
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
  /** Use "h1" when the state replaces the whole page (not found, error). */
  headingLevel?: "h1" | "h2";
}

/** Error, not-found and empty states for content-driven pages. */
function ContentState({
  kind,
  title,
  message,
  onRetry,
  backHref,
  backLabel,
  headingLevel = "h2",
}: ContentStateProps) {
  const Icon = kind === "error" ? AlertTriangle : SearchX;
  const Heading = headingLevel;

  return (
    <div
      role={kind === "error" ? "alert" : undefined}
      className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f8fc] text-[#063b73]">
        <Icon size={24} aria-hidden="true" />
      </span>

      <Heading className="mt-6 text-2xl font-bold tracking-tight text-[#063b73]">
        {title}
      </Heading>

      <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-[#063b73] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b5fa5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30"
          >
            <RotateCw size={16} aria-hidden="true" />
            Try again
          </button>
        )}

        {backHref && (
          <Link
            to={backHref}
            className="group inline-flex items-center gap-2 rounded-full bg-[#f4511e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30"
          >
            {backLabel ?? "Back"}
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

export default ContentState;
