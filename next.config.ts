import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/techverse-academy' : '',
  assetPrefix: isProd ? '/techverse-academy/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Preserve existing turbopack CSS rule
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
