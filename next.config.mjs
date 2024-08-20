/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.ctfassets.net" }],
  },
};

export default nextConfig;
