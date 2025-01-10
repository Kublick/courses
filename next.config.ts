import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "incrementatuconsulta.s3.us-west-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias["yjs"] = path.resolve(__dirname, "node_modules/yjs");
    }
    return config;
  },
};

export default withNextVideo(nextConfig);
