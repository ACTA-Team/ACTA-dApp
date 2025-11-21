import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['acta-builder'],
  turbopack: {},
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      buffer: 'buffer/',
      fs: false,
      path: false,
    };
    config.resolve.mainFields = ['browser', 'module', 'main'];
    config.plugins = [...(config.plugins || [])];
    return config;
  },
};

export default nextConfig;
