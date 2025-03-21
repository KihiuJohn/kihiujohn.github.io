/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['techicons.dev', 'cdn.sanity.io', 'icon.icepanel.io', 'images.unsplash.com'],
  },
  allowedDevOrigins: ['*.preview.same-app.com'],
};
module.exports = nextConfig;