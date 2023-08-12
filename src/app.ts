import express from "express";
import EnvironmentResolver from "./environment/EnvironmentResolver";
import healthcheckRouter from "./api/HealthCheckRoutes";

// Spin up app
const app = express();

// Expose static public assets in API
// TODO: Is this a common practice?
app.use(express.static("public"));

// Pass environment details to each request via middleware
app.use(function (req, res, next) {
  const envPromise = EnvironmentResolver.getEnvironment();
  res.locals.env = envPromise;
  res.locals.pool = envPromise.then((e) => e?.database.getDatabasePool());
  next();
});

// Attach routers in order of evaluation
app.use("/_health", healthcheckRouter);

// Serve custom 404 response if no preceding path was hit
// Note that public assets like HTML can link to other public assets like CSS because they are all exposed in API
// TODO: Should an API layer be concerned with serving static HTML assets? If so, should it also be responsible for styling?
app.get("*", (req, res) => {
  res.status(404);
  res.sendFile("html/NotFound.html", { root: "./public" });
});

export default app;
