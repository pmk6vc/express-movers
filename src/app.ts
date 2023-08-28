import express from "express";
import healthCheckRouter from "./api/HealthCheckRoutes";
import authRouter from "./api/AuthRoutes";
import { Environment } from "./environment/handlers/IEnvironment";
import userRouter from "./api/UserRoutes";
import authenticateUser from "./middleware/AuthenticateUser";

const app = express();
export const buildApp = (env: Environment) => {
  // Expose static public assets in API
  app.use(express.static("public"));

  // Use middlewares in order of evaluation
  app.use(authenticateUser);

  // Attach routers in order of evaluation
  app.use("/_health", healthCheckRouter(env));
  app.use("/auth", authRouter(env));
  app.use("/users", userRouter(env));

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
