import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@anyexamai/i18n',
    '@anyexamai/ui',
    '@tamagui/core',
    '@tamagui/config',
    '@tamagui/themes',
    'react-native-web',
  ],

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@anyexamai/i18n', '@anyexamai/ui'],
  },

  // Webpack configuration for Tamagui
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
    };
    return config;
  },
};

export default nextConfig;
