import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./sections.handlers";
import * as routes from "./sections.route";

const router = createRouter()
  .openapi(routes.updateSectionPosition, handlers.updateLecturePosition)
  .openapi(routes.deleteOneById, handlers.deleteSectionById);
export default router;
