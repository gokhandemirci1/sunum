/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    dynamicIO: true,
  },
}

module.exports = nextConfig

