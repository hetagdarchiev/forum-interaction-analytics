import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true, // <-- отключает серверную оптимизацию
  },
};

export default nextConfig;
