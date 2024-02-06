/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/api/:path*",
    },
    {
      source: "/socket.io",
      destination: "http://localhost:8000/socket.io/",
    },
  ],
  reactStrictMode: false,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
