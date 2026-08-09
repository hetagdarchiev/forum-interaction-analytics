import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true, // <-- отключает серверную оптимизацию
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth',
        permanent: false,
      },
      {
        source: '/registration',
        destination: '/auth',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
