"use server";
import Mux from "@mux/mux-node";
import { nanoid } from "nanoid";

// Initialize Mux client
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export const getMuxUrl = async () => {
  const passthrough = nanoid();

  const uploadUrl = await mux.video.uploads.create({
    cors_origin: "*",
    new_asset_settings: {
      playback_policy: ["public"],
      passthrough,
    },
  });

  console.log(
    "🚀 ~ createUploadUrl:AppRouteHandler<UploadLectureVideo>= ~ uploadUrl:",
    uploadUrl,
  );

  const { url, id } = uploadUrl;

  return {
    id,
    url,
    passthrough,
  };
};
