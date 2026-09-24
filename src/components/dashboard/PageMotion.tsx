"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Subtle enter animation for every dashboard route change. Keyed by SECTION
// (the third path segment) rather than the full pathname: /dashboard/articles/*
// share one key, so the Editor's first-autosave router.replace to the edit
// route does NOT remount the page (which would kill the caret/TipTap focus).
export default function PageMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const key = pathname.split("/")[2] ?? "dashboard";

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
