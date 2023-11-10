import express from "express";
import { Logger } from "winston";
import DatabaseClient from "../db/DatabaseClient";

const router = express.Router();

const healthCheckRouter = (dbClient: DatabaseClient, logger: Logger) => {
  return router.get("/", (req, res) => {
    logger.info("You made it to the health check endpoint!");
    res.send("Hello, world!");
  });
};

export default healthCheckRouter;
