import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configure hostname handling for subdomains
  // Next.js 15.3.3 doesn't have explicit subdomain support in the config
  // so we'll rely on our middleware for subdomain handling
};

export default nextConfig;
