import { Router } from "express";
import { Logger } from "winston";
import DatabaseClient from "../db/DatabaseClient";

export default abstract class AbstractRouter {
  protected router;
  protected logger;
  protected constructor(dbClient: DatabaseClient, logger: Logger) {
    this.router = this.buildRouter(dbClient);
    this.logger = logger;
  }

  protected abstract buildRouter(dbClient: DatabaseClient): Router;
  getRouter() {
    return this.router;
  }
}
