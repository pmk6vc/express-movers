import { Router } from "express";
import { Logger } from "winston";
import DatabaseClient from "../db/DatabaseClient";

export default abstract class AbstractRouter {
  protected router;
  protected constructor(dbClient: DatabaseClient, logger: Logger) {
    this.router = this.buildRouter(dbClient, logger);
  }

  protected abstract buildRouter(
    dbClient: DatabaseClient,
    logger: Logger
  ): Router;
  getRouter() {
    return this.router;
  }
}
