import express from "express";
import healthCheckRouter from "./api/HealthCheckRoutes";
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
  app.use(express.json());
  app.use(authenticateUser);
  app.use(correlatedRequestLogging(env.projectId));

  // Attach routers in order of evaluation
  // TODO: Consider adding some structure here on the arguments and return types
  app.use("/_health", healthCheckRouter(dbClient, env.logger));
  app.use("/users", UserRouter.getRouter(dbClient, env.logger));

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
