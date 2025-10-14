import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['www.staradvertiser.com'], // Lab1 line 164: allow Imge to fetch img from outside domain
  },
  eslint:{
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
