import { AppOpenApi } from "../types";
import packageJSON from "../../../package.json";
import { apiReference } from "@scalar/hono-api-reference";

export default function configureOpenApi(app: AppOpenApi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Incrementa Courses Api",
    },
  });

  app.get(
    "/reference",

    apiReference({
      theme: "kepler",
      layout: "classic",
      spec: {
        url: "/api/doc",
      },
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
    })
  );
}
