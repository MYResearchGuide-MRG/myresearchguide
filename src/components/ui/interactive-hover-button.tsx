import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Mailing List", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group !relative !w-40 !cursor-pointer !overflow-hidden !rounded-lg !border !bg-black !p-2 !text-center !font-semibold",
        className,
      )}
      {...props}
    >
      {/* Initial Text State */}
      <span className="!inline-block !translate-x-1 !transition-all !duration-300 group-hover:!translate-x-12 group-hover:!opacity-0 !text-white !text-md">
        {text}
      </span>

      {/* Hover State Text and Icon */}
      <div className="!absolute !top-0 !z-10 !flex !h-full !w-full !translate-x-12 !items-center !justify-center !gap-2 !opacity-0 !transition-all !duration-300 group-hover:!-translate-x-1 group-hover:!opacity-100 !text-black">
        <span className="!font-semibold">{text}</span>
        <ArrowRight className="!w-4 !h-4" />
      </div>

      {/* The Expanding Background Circle */}
      <div 
        className={cn(
          "!absolute !left-[12%]  !top-[40%] !h-2 !w-2 !scale-[1] !rounded-lg !bg-slate-400 !transition-all !duration-300",
          "group-hover:!left-[0%] group-hover:!top-[0%] group-hover:!h-full group-hover:!w-full group-hover:!scale-[1.8] group-hover:!bg-white group-hover:!rounded-none"
        )}
      />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };