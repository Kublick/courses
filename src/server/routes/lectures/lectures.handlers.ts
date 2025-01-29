import type { AppRouteHandler } from "@/server/types";

import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "@/server/db";
import { lectures, videos } from "@/server/db/schema";
import xss from "xss";
import type {
  CreateLectureRoute,
  DeleteLectureByIdRoute,
  LectureByIdRoute,
  LectureListRoute,
  PublishLectureRoute,
  UpdateLectureByIdRoute,
  UpdateLecturePositionRoute,
  UploadLectureVideo,
} from "./lectures.route";
import { eq } from "drizzle-orm";
import { deleteVideo, getMuxUrl } from "@/server/lib/mux";
import { deleteThumbnail, uploadThumbnail } from "@/lib/s3Actions";
import { deleteLecture } from "../sections/sections.handlers";

export const create: AppRouteHandler<CreateLectureRoute> = async (c) => {
  c.var.logger.info("Creating lecture");

  const { title, description, file, section_id, position, thumbnail } =
    c.req.valid("form");

  let videoId = null;
  let poster_url = "";

  if (file) {
    // Proceed with video upload to Mux
    const { url, passthrough, id } = await getMuxUrl();

    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Video upload to Mux failed");
    }

    // Insert video metadata into the `videos` table
    const [videoInsert] = await db
      .insert(videos)
      .values({
        status: "waiting",
        passthrough,
        upload_id: id,
      })
      .returning();

    videoId = videoInsert.id;
  }

  if (thumbnail instanceof File) {
    poster_url = await uploadThumbnail(thumbnail);
  }

  const sanitizedDescription = xss(description ?? "");

  try {
    const [lecture] = await db
      .insert(lectures)
      .values({
        title,
        description: sanitizedDescription,
        section_id,
        content_type: file?.type ?? null,
        position: Number(position),
        video: videoId,
        poster_url: poster_url,
      })
      .returning();

    return c.json({ id: lecture.id }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error creating lecture:", error);
    return c.json(
      {
        error: {
          issues: [
            {
              code: "file_error",
              path: ["file"],
              message: "An error occurred while processing the lecture",
            },
          ],
          name: "ValidationError",
        },
        success: false,
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

export const list: AppRouteHandler<LectureListRoute> = async (c) => {
  c.var.logger.info("Listing lectures");

  const lecture = await db.select().from(lectures);

  return c.json(lecture, HttpStatusCodes.OK);
};

export const getOneById: AppRouteHandler<LectureByIdRoute> = async (c) => {
  const params = c.req.param("id");

  c.var.logger.info(`Listing lectures ${params}`);

  const lecture = await db.query.lectures.findFirst({
    where: eq(lectures.id, params),
    with: {
      video: true,
    },
  });

  if (!lecture) {
    return c.json({ message: "Lecture not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    { ...lecture, video: lecture.video ?? undefined },
    HttpStatusCodes.OK
  );
};

export const deleteById: AppRouteHandler<DeleteLectureByIdRoute> = async (
  c
) => {
  c.var.logger.info("Handling deleteById request");

  const lectureId = c.req.param("id");

  const result = await deleteLecture(lectureId);

  if (!result.success) {
    return c.json({ message: result.message }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: result.message }, HttpStatusCodes.OK);
};

export const uploadVideo: AppRouteHandler<UploadLectureVideo> = async (c) => {
  c.var.logger.info("Uploading video");

  const body = c.req.valid("form");

  const { file } = body;

  if (!file) {
    return c.json(
      { message: "File is required" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
  try {
    const uploadAsset = await getMuxUrl();

    await fetch(uploadAsset.url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    return c.json({ id: uploadAsset.id }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error uploading video:", error);
    return c.json(
      { message: "Por favor, selecciona un archivo de video" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

export const updateOneById: AppRouteHandler<UpdateLectureByIdRoute> = async (
  c
) => {
  c.var.logger.info("Updating lecture");

  const { id } = c.req.valid("param");
  const { title, description, file, thumbnail } = c.req.valid("form");

  // Check if lecture exists
  const existingLecture = await db.query.lectures.findFirst({
    where: (lectures, { eq }) => eq(lectures.id, id),
    with: {
      video: true,
    },
  });

  if (!existingLecture) {
    return c.json({ message: "Lecture not found" }, HttpStatusCodes.NOT_FOUND);
  }

  let videoId = existingLecture.video?.asset_id;
  let newContentType = existingLecture.content_type;
  let newPosterUrl = existingLecture.poster_url;

  // Handle video update
  if (file) {
    try {
      // Only delete existing video if we're uploading a new one
      if (videoId !== null && videoId !== undefined) {
        c.var.logger.debug("Deleting existing video");
        await deleteVideo(videoId);
      }

      const { url, passthrough, id: uploadId } = await getMuxUrl();

      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) throw new Error("Mux upload failed");

      const [videoInsert] = await db
        .insert(videos)
        .values({
          status: "waiting",
          passthrough,
          upload_id: uploadId,
        })
        .returning();

      videoId = videoInsert.id;
      newContentType = file.type;
    } catch (error) {
      console.error("Video update error:", error);
      return c.json(
        { message: "Failed to process video update" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Handle thumbnail update
  if (thumbnail) {
    try {
      newPosterUrl = await uploadThumbnail(thumbnail);
      if (existingLecture.poster_url) {
        await deleteThumbnail(existingLecture.poster_url);
      }
    } catch (error) {
      console.error("Thumbnail update error:", error);
      return c.json(
        { message: "Failed to process thumbnail update" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Prepare update data
  const updateData: {
    title: string;
    description?: string;
    video?: string | null;
    content_type?: string | null;
    poster_url?: string;
    updated_at: string;
  } = { title, updated_at: new Date().toISOString() };

  if (description !== undefined) {
    updateData.description = xss(description);
  }

  // Only update video-related fields if a new file was provided
  if (file) {
    updateData.video = videoId;
    updateData.content_type = newContentType;
  }

  if (thumbnail) {
    updateData.poster_url = newPosterUrl || undefined;
  }

  // Update database
  try {
    const [updatedLecture] = await db
      .update(lectures)
      .set(updateData)
      .where(eq(lectures.id, id))
      .returning();

    if (!updatedLecture) {
      return c.json(
        { message: "Lecture not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      { message: "Lecture updated successfully" },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Database update error:", error);
    return c.json(
      { message: "An error occurred while updating the lecture" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const publishLecture: AppRouteHandler<PublishLectureRoute> = async (
  c
) => {
  c.var.logger.info("Publishing lecture");

  const id = c.req.param("id");
  const { is_published } = c.req.valid("json");

  const lecture = await db
    .update(lectures)
    .set({
      is_published: is_published,
    })
    .where(eq(lectures.id, id));

  if (!lecture) {
    return c.json({ message: "Lecture not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Lecture published" }, HttpStatusCodes.OK);
};
export const updateLecturePosition: AppRouteHandler<
  UpdateLecturePositionRoute
> = async (c) => {
  c.var.logger.info("updating lectures");

  const items = c.req.valid("json");

  for (const lecture of items) {
    const { id, position, sectionId } = lecture;

    try {
      const updatedLecture = await db
        .update(lectures)
        .set({ position, section_id: sectionId })
        .where(eq(lectures.id, id));

      if (!updatedLecture) {
        return c.json(
          { message: "Lecture not found" },
          HttpStatusCodes.NOT_FOUND
        );
      }
    } catch (error) {
      console.log("Error updating lecture position", error);
    }
  }

  return c.json({ message: "Lecture updated" }, HttpStatusCodes.OK);
};
