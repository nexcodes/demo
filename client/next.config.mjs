/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        port: "1337",
      },
      {
        hostname: "demo-1xag.onrender.com",
      },
    ],
  },
};

export default nextConfig;
