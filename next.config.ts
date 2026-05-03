import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/polecana-autoholowanie-:path*',
        destination: '/polecane-autoholowanie-:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
