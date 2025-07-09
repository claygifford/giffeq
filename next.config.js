/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  //swcMinify: true,
  eslint: {
    dirs: ["pages", "lib", "components"],
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId },
  ) {
    return {
      "/": { page: "/", query: { __nextDefaultLocale: "en-US" } },
      "/about": { page: "/about", query: { __nextDefaultLocale: "en-US" } },
      "/about/login": {
        page: "/about/login",
        query: { __nextDefaultLocale: "en-US" },
      },
      "/about/recovery": {
        page: "/about/recovery",
        query: { __nextDefaultLocale: "en-US" },
      },
      "/about/signup": {
        page: "/about/signup",
        query: { __nextDefaultLocale: "en-US" },
      },
      "/privacy": { page: "/privacy", query: { __nextDefaultLocale: "en-US" } },
    };
  },
  experimental: {
    turbo: {
      moduleIdStrategy: "deterministic",
    },
  },
  images: {
    domains: ["i.scdn.co"],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
