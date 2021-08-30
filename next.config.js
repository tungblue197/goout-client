/** @type {import('next').NextConfig} */
// const withPlugins = require('next-compose-plugins')
// const withImages = require('next-images')

module.exports = {
  reactStrictMode: true,
  images:{
    domains: ['lh3.googleusercontent.com']
  }
}

// module.exports = withPlugins([[withImages]], nextConfig)