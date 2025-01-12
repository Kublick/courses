import { AppRouteHandler } from "@/server/types";

import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "@/server/db";
import { lectures, videos } from "@/server/db/schema";

import {
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
import { deleteThumbanil, uploadThumbnail } from "@/lib/s3Actions";

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
  try {
    // Insert the lecture into the database
    const [lecture] = await db
      .insert(lectures)
      .values({
        title,
        description,
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
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
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
    HttpStatusCodes.OK,
  );
};

export const deleteById: AppRouteHandler<DeleteLectureByIdRoute> = async (
  c,
) => {
  c.var.logger.info("Deleting Lecture");

  const getLecture = await db.query.lectures.findFirst({
    where: eq(lectures.id, c.req.param("id")),
    with: {
      video: true,
    },
  });

  const assetId = getLecture?.video?.asset_id;
  if (assetId) {
    await deleteVideo(assetId);
  }

  if (getLecture?.poster_url) {
    await deleteThumbanil(getLecture.poster_url);
  }

  const lecture = await db
    .delete(lectures)
    .where(eq(lectures.id, c.req.param("id")));

  if (!lecture) {
    return c.json({ message: "Lecture not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Lecture deleted" }, HttpStatusCodes.OK);
};

export const updateOneById: AppRouteHandler<UpdateLectureByIdRoute> = async (
  c,
) => {
  c.var.logger.info("Updating lecture");

  const { title, description, content_type, section_id, position } =
    c.req.valid("json");

  const lecture = await db
    .update(lectures)
    .set({
      title,
      description,
      content_type,
      section_id,
      position,
    })
    .where(eq(lectures.id, c.req.param("id")));

  if (!lecture) {
    return c.json({ message: "Lecture not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Lecture updated" }, HttpStatusCodes.OK);
};

export const uploadVideo: AppRouteHandler<UploadLectureVideo> = async (c) => {
  c.var.logger.info("Uploading video");

  const body = c.req.valid("form");

  const { file } = body;

  if (!file) {
    return c.json(
      { message: "File is required" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
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
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
};

export const publishLecture: AppRouteHandler<PublishLectureRoute> = async (
  c,
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
          HttpStatusCodes.NOT_FOUND,
        );
      }
    } catch (error) {
      console.log("Error updating lecture position", error);
    }
  }

  return c.json({ message: "Lecture updated" }, HttpStatusCodes.OK);
};
