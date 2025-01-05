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
      {
        protocol: "https",
        hostname: "incrementatuconsulta.s3.us-west-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default withNextVideo(nextConfig);
