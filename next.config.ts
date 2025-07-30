import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["http://192.168.100.252", "http://192.168.100.27"],
  },
};

export default nextConfig;