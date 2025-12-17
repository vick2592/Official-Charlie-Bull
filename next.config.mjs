/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@0xsquid/widget", "@0xsquid/react-hooks", "wagmi", "viem"],
  reactStrictMode: true,
  // Empty turbopack config to silence the warning - we're using transpilePackages which works for both
  turbopack: {},
};

export default nextConfig;
