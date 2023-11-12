import express, { Request, Response, Router } from "express";
import { GLOBAL_LOG_OBJ } from "../middleware/CorrelatedRequestLogging";
import AbstractRouter from "./AbstractRouter";

export default class HealthChecksRouter extends AbstractRouter {
  private helloWorld = async (req: Request, res: Response) => {
    this.logger.info(
      "Hello from the health check endpoint!",
      res.locals[GLOBAL_LOG_OBJ]
    );
    res.send("Hello, world!");
  };
  buildRouter(): Router {
    return express.Router().get("/", this.helloWorld);
  }
}
