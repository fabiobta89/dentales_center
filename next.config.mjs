/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
