/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing code...
  
  // Add detailed error output during build
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Add Webpack configuration for better error logging
  webpack: (config, { isServer, dev }) => {
    // Add source maps in development
    if (dev) {
      config.devtool = 'source-map';
    }
    
    // Return the modified config
    return config;
  },

  // ...existing code...
}

module.exports = nextConfig
