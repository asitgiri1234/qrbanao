import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Produces a slim, self-contained build for the Docker runtime image.
  output: 'standalone',
  images: {
    remotePatterns: [
      // Restaurant logos are stored as remote URLs in Phase 1.
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
