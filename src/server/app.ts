import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import index from "./routes/index.route";

const app = createApp();

configureOpenApi(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/", index);

export type AppType = typeof routes;

export default app;
