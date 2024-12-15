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
    uploadUrl
  );

  const { url, id } = uploadUrl;

  return {
    id,
    url,
    passthrough,
  };
};

// export async function createUploadUrl() {
//   try {
//     const upload = await mux.video.uploads.create({
//         cors_origin: '*',
//         new_asset_settings: {
//           playback_policy: ['public'],
//           video_quality: 'basic'
//         }})

//     return {
//       uploadUrl: upload.url,
//       uploadId: upload.id,
//     }
//   } catch (error) {
//     console.error('Error creating Mux upload:', error)
//     throw new Error('Failed to create upload URL')
//   }
// }

// export async function checkUploadStatus(uploadId: string) {
//   try {
//     const upload = await mux.video.uploads.retrieve(uploadId)
//     return {
//       status: upload.status,
//       assetId: upload.asset_id,
//     }
//   } catch (error) {
//     console.error('Error checking upload status:', error)
//     throw new Error('Failed to check upload status')
//   }
// }
