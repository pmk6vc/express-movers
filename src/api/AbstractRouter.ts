import { Router } from "express";
import { Logger } from "winston";
import DatabaseClient from "../db/DatabaseClient";

export default abstract class AbstractRouter {
  protected dbClient;
  protected logger;
  constructor(dbClient: DatabaseClient, logger: Logger) {
    this.dbClient = dbClient;
    this.logger = logger;
  }

  abstract buildRouter(): Router;
}
