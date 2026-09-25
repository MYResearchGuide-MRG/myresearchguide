import React from "react";
import { Lock } from "lucide-react";

type AppWindowProps = {
  children: React.ReactNode;
  /** Shown in the address bar, e.g. "myresearchguide.notion.site". */
  url?: string;
  className?: string;
  /** Classes for the window body (below the toolbar). */
  bodyClassName?: string;
  /** Animate a light travelling around the window edge. */
  edgeLight?: boolean;
};

/**
 * Floating browser window: toolbar with traffic lights and an address bar,
 * lifted off the page by a deep shadow and a faint top-edge highlight.
 * Shared by the hero handbook preview and the Handbook section.
 */
export default function AppWindow({
  children,
  url,
  className = "",
  bodyClassName = "",
  edgeLight = false,
}: AppWindowProps) {
  return (
    <div
      className={`!relative !rounded-xl md:!rounded-2xl !overflow-hidden !bg-[#0f0f10] ${className}`}
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 120px -30px rgba(255,255,255,0.10), 0 50px 100px -20px rgba(0,0,0,0.9)",
      }}
    >
      <div className="!relative !flex !items-center !h-10 md:!h-11 !px-4 !bg-[#1a1a1c] !border-b !border-black/60">
        <div className="!flex !gap-2 !shrink-0" aria-hidden>
          <span className="!h-3 !w-3 !rounded-full !bg-[#ff5f57]" />
          <span className="!h-3 !w-3 !rounded-full !bg-[#febc2e]" />
          <span className="!h-3 !w-3 !rounded-full !bg-[#28c840]" />
        </div>
        {url && (
          <div className="!absolute !left-1/2 !-translate-x-1/2 !flex !items-center !justify-center !gap-1.5 !h-6 md:!h-7 !w-[55%] sm:!w-[45%] !max-w-md !rounded-md !bg-black/40 !text-[11px] md:!text-xs !text-zinc-400">
            <Lock size={11} aria-hidden className="!shrink-0" />
            <span className="!truncate">{url}</span>
          </div>
        )}
      </div>
      <div className={bodyClassName}>{children}</div>
      {edgeLight && (
        <div
          aria-hidden
          className="window-edge-light !pointer-events-none !absolute !inset-0 !z-30 !rounded-[inherit]"
        />
      )}
    </div>
  );
}
