import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  
};

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
