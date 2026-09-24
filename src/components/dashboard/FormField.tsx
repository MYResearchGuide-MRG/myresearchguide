import type { ReactNode } from "react";

// Pure presentational field wrapper: uppercase label above, optional
// right-edge icon overlay for the input below. No client hooks, so it is
// safe to render from server components too.
export function FormField({
  label,
  id,
  icon,
  children,
}: {
  label: string;
  id: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="!block !text-xs !uppercase !tracking-wider !text-zinc-500 !mb-1.5"
      >
        {label}
      </label>
      <div className="!relative">
        {children}
        {icon ? (
          <span className="!absolute !right-3.5 !top-1/2 !-translate-y-1/2 !text-zinc-600 !pointer-events-none">
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
}
