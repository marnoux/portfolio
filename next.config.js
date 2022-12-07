/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['marnoux.github.io', 'media-exp1.licdn.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
