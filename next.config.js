/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '**',
      },
    ],
  },
  basePath: '',
  assetPrefix: '',
  devIndicators: false,
  allowedDevOrigins: ['*.local', 'localhost'],
}

export default nextConfig