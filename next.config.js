/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:3000/:path*",
    },
    {
      source: "/socket.io",
      destination: `http://localhost:3000/socket.io/`,
    },
  ],
  reactStrictMode: false,
};

module.exports = nextConfig;
