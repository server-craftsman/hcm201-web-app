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
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: process.env.NODE_ENV === 'development' ? [
          // TEMPORARILY DISABLE CSP FOR TESTING
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline' https://accounts.google.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-src 'self' https://accounts.google.com",
              "frame-ancestors 'none'",
              "connect-src 'self' ws: wss: https: http://localhost:* http://127.0.0.1:* https://accounts.google.com https://oauth2.googleapis.com",
            ].join('; '),
          },
        ] : [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow Google OAuth scripts (production)
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline' https://accounts.google.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // Allow Google OAuth frames (production)
              "frame-src 'self' https://accounts.google.com",
              "frame-ancestors 'none'",
              // Production: Only allow HTTPS connections + Google OAuth
              "connect-src 'self' ws: wss: https: https://accounts.google.com https://oauth2.googleapis.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;