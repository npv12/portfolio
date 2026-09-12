/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.svgporn.com",
      },
    ],
  },
};

export default nextConfig;
