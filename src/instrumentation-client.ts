import posthog from "posthog-js";

// Runs once in the browser before hydration (Next.js instrumentation-client).
// Requests go through /ingest (see next.config.mjs) so ad blockers don't drop them.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24", // pageviews on client-side route changes, pageleave
    persistence: "localStorage+cookie",
    capture_pageleave: true,
    autocapture: true, // link/button clicks, so handbook + community links are tracked
    disable_session_recording: true,
  });

  // The PostHog project is shared with the personal site: tag every event so
  // the two can be split (filter `site = myresearchguide`).
  posthog.register({ site: "myresearchguide" });
}
