import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["sharp"],
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
