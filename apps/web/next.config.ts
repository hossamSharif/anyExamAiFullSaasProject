import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@anyexamai/i18n'],

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@anyexamai/i18n'],
  },
};

export default nextConfig;
