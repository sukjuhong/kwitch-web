/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/:path*",
    },
    {
      source: "/socket.io",
      destination: `http://localhost:8000/socket.io/`,
    },
  ],
  reactStrictMode: false,
};

module.exports = nextConfig;
