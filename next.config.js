/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Vercel deployment
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
  // Remove assetPrefix and basePath for direct Vercel deployment
}

module.exports = nextConfig