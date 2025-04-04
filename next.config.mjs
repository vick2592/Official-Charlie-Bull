/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@0xsquid/widget", "@0xsquid/react-hooks"],
  swcMinify: false,
  reactStrictMode: true,
};

export default nextConfig;
