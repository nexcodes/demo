/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        port: "1337",
      },
      {
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
