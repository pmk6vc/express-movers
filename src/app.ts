import express from "express";
import authRouter from "./api/AuthRoutes";
import healthCheckRouter from "./api/HealthCheckRoutes";
import userRouter from "./api/UserRoutes";
import DatabaseClient from "./db/DatabaseClient";
import authenticateUser from "./middleware/AuthenticateUser";

const app = express();
export const buildApp = (dbClient: DatabaseClient) => {
  // Expose static public assets in API
  app.use(express.static("public"));

  // Use middlewares in order of evaluation
  app.use(authenticateUser);

  // Attach routers in order of evaluation
  // TODO: Consider adding some structure here on the arguments and return types
  app.use("/_health", healthCheckRouter(dbClient));
  app.use("/auth", authRouter(dbClient));
  app.use("/users", userRouter(dbClient));

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
