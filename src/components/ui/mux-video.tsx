"use client";

import Player from "next-video/player";
import Image from "next/image";

interface Props {
  playbackId: string;
  posterUrl?: string;
}

const VideoPlayer = ({ playbackId, posterUrl }: Props) => {
  const videoUrl = `https://stream.mux.com/${playbackId}.m3u8`;

  return (
    <Player src={videoUrl}>
      {posterUrl && (
        <Image slot="poster" src={posterUrl} alt="poster" layout="fill" />
      )}
    </Player>
  );
};

export default VideoPlayer;
