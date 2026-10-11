/** @type {import('next').NextConfig} */
const nextConfig = {
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