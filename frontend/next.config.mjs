import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Turbopack config (empty object silences the error if you don't need custom rules)
  turbopack: {},

  // If you really need aliases, rely on tsconfig.json paths instead.
  // Turbopack automatically respects tsconfig.json "paths".
};

export default nextConfig;
