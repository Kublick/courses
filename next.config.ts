import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default withNextVideo(nextConfig);
