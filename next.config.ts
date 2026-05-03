import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/polecana-autoholowanie-:slug',
        destination: '/polecane-autoholowanie-:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
