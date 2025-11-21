import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['acta-builder'],
  turbopack: {},
  webpack: (config) => {
    const { ProvidePlugin } = require('webpack');
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      buffer: require.resolve('buffer/'),
      fs: false,
      path: false
    };
    config.resolve.mainFields = ['browser', 'module', 'main'];
    config.plugins = [
      ...(config.plugins || []),
      new ProvidePlugin({ Buffer: ['buffer', 'Buffer'] })
    ];
    return config;
  },
};

export default nextConfig;
