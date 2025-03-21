/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // Crucial for static export on GitHub Pages:
    unoptimized: true,  
    domains: ['techicons.dev', 'cdn.sanity.io', 'icon.icepanel.io', 'images.unsplash.com'],
  },
  allowedDevOrigins: ['*.preview.same-app.com'],
};

module.exports = nextConfig;
