import AbstractHandler from "./AbstractHandler";
import CloudSqlPostgresConfig from "../util/CloudSqlPostgresConfig";
import run from "node-pg-migrate";

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
  async runUpMigrations() {
    const env = await this.getEnvironment();
    await run({
      migrationsTable: "pgmigrations",
      dir: "/app/migrations",
      direction: "up",
      databaseUrl: env.database.getConnectionString(),
    });
  }

  async runDownMigrations() {
    const env = await this.getEnvironment();
    await run({
      migrationsTable: "pgmigrations",
      dir: "/app/migrations",
      direction: "down",
      databaseUrl: env.database.getConnectionString(),
    });
  }
}
