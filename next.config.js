/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['techicons.dev', 'cdn.sanity.io', 'icon.icepanel.io', 'images.unsplash.com'],
  },
  allowedDevOrigins: [
    '*.preview.same-app.com',
  ],
  output: 'export', // Enables static HTML export for GitHub Pages
};

module.exports = nextConfig;