import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow development from local network
  allowedDevOrigins: ["*"],
};

export default nextConfig;
