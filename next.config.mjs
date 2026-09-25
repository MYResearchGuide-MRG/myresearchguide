/** @type {import('next').NextConfig} */
const nextConfig = {
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