import express, { Request, Response, Router } from "express";
import { GLOBAL_LOG_OBJ } from "../middleware/CorrelatedRequestLogging";
import AbstractRouter from "./AbstractRouter";

export default class HealthChecksRouter extends AbstractRouter {
  private ping = async (req: Request, res: Response) => {
    this.logger.info("You pinged me!", res.locals[GLOBAL_LOG_OBJ]);
    res.send("Ping!");
  };
  buildRouter(): Router {
    return express.Router().get("/ping", this.ping);
  }
}
