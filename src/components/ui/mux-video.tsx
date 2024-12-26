"use client";

import Player from "next-video/player";

const VideoPlayer = ({ playbackId }: { playbackId: string }) => {
  const videoUrl = `https://stream.mux.com/${playbackId}.m3u8`;

  return <Player src={videoUrl} />;
};

export default VideoPlayer;
