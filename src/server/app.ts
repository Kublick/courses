import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import index from "./routes/index.route";
import auth from "./routes/auth/auth.index";
import user from "./routes/users/users.index";
import courses from "./routes/courses/courses.index";
import lectures from "./routes/lectures/lectures.index";

const app = createApp();

configureOpenApi(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/", index)
  .route("/", auth)
  .route("/", user)
  .route("/", courses)
  .route("/", lectures);

export type AppType = typeof routes;

export default app;
