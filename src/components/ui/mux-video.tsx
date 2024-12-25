import Video from "next-video";

const MuxVideoPlayer = ({ playbackId }: { playbackId: string }) => {
  const videoUrl = `https://stream.mux.com/${playbackId}.m3u8`;

  return <Video src={videoUrl} autoPlay controls loop muted playsInline />;
};

export default MuxVideoPlayer;
