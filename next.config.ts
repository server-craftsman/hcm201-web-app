import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "scontent.fsgn2-10.fna.fbcdn.net" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  eslint: {
    // Disable ESLint checks during production builds to avoid toolchain dependency
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;