import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cdn1.selll.online/**"),
    ],
  }
};

export default nextConfig;
