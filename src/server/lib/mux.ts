"use server";
import Mux from "@mux/mux-node";
import { nanoid } from "nanoid";
import db from "../db";
import { lectures } from "../db/schema";
import { eq } from "drizzle-orm";

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

  const { url, id } = uploadUrl;

  return {
    id,
    url,
    passthrough,
  };
};

export const deleteVideo = async (id: string) => {
  try {
    await mux.video.assets.delete(id);

    return true;
  } catch (err) {
    console.log("deleted video false");
    return false;
  }
};
