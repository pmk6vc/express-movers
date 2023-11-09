import { Logging } from "@google-cloud/logging";
import CloudSqlPostgresConfig from "../util/CloudSqlPostgresConfig";
import AbstractHandler from "./AbstractHandler";

export class ProductionHandler extends AbstractHandler {
  private static instance: ProductionHandler;

  private constructor() {
    super();
  }

  protected async getDatabaseConfig() {
    if (!this.databaseConfig) {
      this.databaseConfig = new CloudSqlPostgresConfig(
        process.env.DB_USERNAME!,
        process.env.DB_PASSWORD!,
        process.env.DB_HOST!,
        +process.env.DB_PORT!,
        process.env.DB_NAME!
      );
    }
    return this.databaseConfig;
  }

  protected override async getLogger() {
    if (!this.logger) {
      const loggingClient = new Logging({
        projectId: process.env.GCP_PROJECT_ID,
      });
      this.logger = loggingClient.log(this.logName);
    }
    return this.logger;
  }

  static getInstance() {
    if (!ProductionHandler.instance) {
      ProductionHandler.instance = new ProductionHandler();
    }
    return ProductionHandler.instance;
  }
}
