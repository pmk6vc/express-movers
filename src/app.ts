import express from "express";
import EnvironmentResolver from "./environment/EnvironmentResolver";
import healthcheckRouter from "./api/healthchecks/HealthCheckRoutes";

// Spin up app
const app = express();

// Pass environment details to each request via middleware
// TODO: Add test coverage for this
app.use(function (req, res, next) {
  const envPromise = EnvironmentResolver.getEnvironment();
  res.locals.env = envPromise;
  res.locals.pool = envPromise.then((e) => e?.database.getDatabasePool());
  next();
});






// Attach routers
app.use("/_health", healthcheckRouter);

export default app;
