import AbstractHandler from "./AbstractHandler";
import CloudSqlPostgresConfig from "../util/CloudSqlPostgresConfig";
import run from "node-pg-migrate";
import { executeMigrations } from "../../util/MigrationUtil";

export class ProductionHandler extends AbstractHandler {
  protected async getDatabaseConfig() {
    if (this.databaseConfig == undefined) {
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
  async runMigrations() {
    const env = await this.getEnvironment();
    await executeMigrations(env, "/app/migrations");
  }
}
