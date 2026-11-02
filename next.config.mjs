/** @type {import('next').NextConfig} */
const nextConfig = {
  // Opt-in for the local preview: gzip responses stall in this Windows runtime.
  // Normal development and hosted production keep Next.js compression enabled.
  compress: process.env.MRG_LOCAL_PREVIEW !== "1",
  // Give each local build fresh asset URLs after switching previews.
  deploymentId: process.env.MRG_LOCAL_PREVIEW_ID,
  // PostHog reverse proxy (first-party path, avoids ad blockers).
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/array/:path*", destination: "https://us-assets.i.posthog.com/array/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  skipTrailingSlashRedirect: true,
  // "Articles" was renamed to "Events"; keep old links working.
  async redirects() {
    return [
      { source: "/articles", destination: "/events", permanent: true },
      { source: "/articles/:slug", destination: "/events/:slug", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui.aceternity.com',
      },
    ],
  },
};

export default nextConfig;
