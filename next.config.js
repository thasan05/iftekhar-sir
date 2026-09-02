/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Database drivers use dynamic requires and ship WebAssembly; let Node load
  // them at runtime instead of bundling them.
  serverExternalPackages: ["pg", "@electric-sql/pglite"],
  // Pin the workspace root so Turbopack never walks up past the project folder
  // looking for a lockfile.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
