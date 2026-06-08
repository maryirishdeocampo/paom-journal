import type { NextConfig } from "next";

/**
 * GitHub Pages serves static files only.
 * Set NEXT_PUBLIC_BASE_PATH to "/your-repo-name" for project pages,
 * or leave empty for username.github.io root sites.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
