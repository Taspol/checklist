import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow development from local network
  allowedDevOrigins: ["*"],
  // Ignore data folder to prevent refresh when tables.json changes
  watchOptions: {
    ignored: ['**/data/**', '**/node_modules/**', '**/.git/**'],
  },
};

export default nextConfig;
