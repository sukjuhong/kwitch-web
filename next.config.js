/** @type {import('next').NextConfig} */

const API_URL = process.env.API_URL || "http://localhost:8000";

const nextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${API_URL}/api/:path*`,
    },
    {
      source: "/socket.io",
      destination: `${API_URL}/socket.io/`,
    },
  ],
  reactStrictMode: false,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
