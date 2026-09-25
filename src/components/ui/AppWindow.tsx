import React from "react";

type AppWindowProps = {
  children: React.ReactNode;
  /** Optional label shown in the middle of the title bar. */
  title?: string;
  className?: string;
  /** Classes for the window body (below the title bar). */
  bodyClassName?: string;
};

/**
 * Minimal app-window frame (title bar + 3 dots) sitting on a soft monochrome
 * gradient stage. Shared by the hero handbook preview and the Handbook section.
 */
export default function AppWindow({
  children,
  title,
  className = "",
  bodyClassName = "",
}: AppWindowProps) {
  return (
    <div
      className={`!relative !rounded-[1.75rem] !p-2 sm:!p-4 md:!p-6 !overflow-hidden ${className}`}
      style={{
        background:
          "radial-gradient(120% 90% at 85% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0) 70%), radial-gradient(90% 80% at 0% 100%, rgba(148,163,184,0.18) 0%, rgba(148,163,184,0) 60%), #0c0c0d",
      }}
    >
      {/* Film grain so the gradient doesn't band */}
      <div
        aria-hidden
        className="!pointer-events-none !absolute !inset-0 !opacity-[0.18] !mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="!relative !rounded-xl md:!rounded-2xl !border !border-white/10 !bg-[#0a0a0a] !shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] !overflow-hidden">
        <div className="!relative !flex !items-center !h-9 md:!h-10 !px-4 !border-b !border-white/[0.06]">
          <div className="!flex !gap-1.5" aria-hidden>
            <span className="!h-2.5 !w-2.5 !rounded-full !bg-white/15" />
            <span className="!h-2.5 !w-2.5 !rounded-full !bg-white/15" />
            <span className="!h-2.5 !w-2.5 !rounded-full !bg-white/15" />
          </div>
          {title && (
            <span className="!absolute !left-1/2 !-translate-x-1/2 !text-[11px] md:!text-xs !text-zinc-500 !truncate !max-w-[60%]">
              {title}
            </span>
          )}
        </div>
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  );
}
