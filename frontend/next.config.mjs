// next.config.mjs
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "frontend/components"),
      "@app": path.resolve(__dirname, "frontend/app"),
      "@lib": path.resolve(__dirname, "frontend/lib"),
      "@utils": path.resolve(__dirname, "frontend/utils")
    };
    return config;
  }
};

export default nextConfig;
