import express from "express";
import { Logger } from "winston";
import DatabaseClient from "../db/DatabaseClient";
import { GLOBAL_LOG_OBJ } from "../middleware/CorrelatedRequestLogging";

const router = express.Router();

const healthCheckRouter = (dbClient: DatabaseClient, logger: Logger) => {
  return router.get("/", (req, res) => {
    logger.info(
      "You made it to the health check endpoint!",
      res.locals[GLOBAL_LOG_OBJ]
    );
    res.send("Hello, world!");
  });
};

export default healthCheckRouter;
