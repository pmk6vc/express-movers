import { Router } from "express";
import DatabaseClient from "../db/DatabaseClient";

export default abstract class AbstractRouter {
  protected router;
  protected constructor(dbClient: DatabaseClient) {
    this.router = this.buildRouter(dbClient);
  }

  protected abstract buildRouter(dbClient: DatabaseClient): Router;
  getRouter() {
    return this.router;
  }
}
