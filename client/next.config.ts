/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // In Next.js v15/v16+, turbopack is a top-level option!
  turbopack: {
    // Tells Turbopack that the 'client' folder is your true project root
    root: __dirname,
  },
};

module.exports = nextConfig;