import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./lectures.handlers";
import * as routes from "./lectures.route";

const router = createRouter()
  .openapi(routes.create, handlers.create)
  .openapi(routes.list, handlers.list)
  .openapi(routes.deleteOneById, handlers.deleteById)
  .openapi(routes.updateOneById, handlers.updateOneById)
  .openapi(routes.uploadVideo, handlers.uploadVideo)
  .openapi(routes.getOneById, handlers.getOneById)
  .openapi(routes.publishLecture, handlers.publishLecture)
  .openapi(routes.updateLecturePosition, handlers.updateLecturePosition);

export default router;
