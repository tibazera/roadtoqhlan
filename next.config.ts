import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? "/roadtoqhlan" : "";

const nextConfig: NextConfig = {
  output: githubPages ? "export" : undefined,
  basePath,
  trailingSlash: true,
  images: { unoptimized: githubPages },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  cacheComponents: !githubPages,
  partialPrefetching: !githubPages,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
