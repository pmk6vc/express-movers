import express from "express";
import HealthChecksRouter from "./api/HealthChecksRouter";
import UserRouter from "./api/UserRouter";
import DatabaseClient from "./db/DatabaseClient";
import { Environment } from "./environment/handlers/IEnvironment";
import authenticateUser from "./middleware/AuthenticateUser";
import correlatedRequestLogging from "./middleware/CorrelatedRequestLogging";

const app = express();
export const buildApp = async (env: Environment, dbClient: DatabaseClient) => {
  // Expose static public assets in API
  app.use(express.static("public"));

  // Use middlewares in order of evaluation
  app.use(correlatedRequestLogging(env.projectId));
  app.use(express.json());
  app.use(authenticateUser(dbClient, env.logger));

  // Attach routers in order of evaluation
  app.use(
    "/_health",
    new HealthChecksRouter(dbClient, env.logger).buildRouter(),
  );
  app.use("/users", new UserRouter(dbClient, env.logger).buildRouter());

  // Serve custom 404 response if no preceding path was hit
  // Note that public assets like HTML can link to other public assets like CSS because they are all exposed in API
  // TODO: Add test coverage for this wildcard
  app.get("*", (req, res) => {
    res.status(404);
    res.sendFile("html/NotFound.html", { root: "./public" });
  });

  return app;
};

export default app;
