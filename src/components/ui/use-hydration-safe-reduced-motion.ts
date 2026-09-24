"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getClientSnapshot(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  // Always false on the server so SSR markup matches the first client paint.
  return false;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(QUERY);
  const handler = () => onStoreChange();

  if (typeof mediaQueryList.addEventListener === "function") {
    mediaQueryList.addEventListener("change", handler);
    return () => mediaQueryList.removeEventListener("change", handler);
  }

  // Safari < 14
  mediaQueryList.addListener(handler);
  return () => mediaQueryList.removeListener(handler);
}

/**
 * SSR-safe prefers-reduced-motion reader.
 * Returns false during SSR and the first client snapshot path via getServerSnapshot,
 * then the live matchMedia value after hydration.
 */
export function useHydrationSafeReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export default useHydrationSafeReducedMotion;
