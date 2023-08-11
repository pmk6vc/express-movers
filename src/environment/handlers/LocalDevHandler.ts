import AbstractHandler from "./AbstractHandler";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import PostgresConfig from "../util/PostgresConfig";
import run from "node-pg-migrate";

export class LocalDevHandler extends AbstractHandler {
  protected override async getServerConfig() {
    if (this.serverConfig == undefined) {
      this.serverConfig = {
        serverPort: 5495,
      };
    }
    return this.serverConfig;
  }
  protected override async getDatabaseConfig() {
    if (this.databaseConfig == undefined) {
      const container = await new PostgreSqlContainer().start();
      this.databaseConfig = new PostgresConfig(
        container.getUsername(),
        container.getPassword(),
        container.getHost(),
        container.getPort(),
        container.getDatabase()
      );
    }
    return this.databaseConfig;
  }
  async runUpMigrations() {
    const env = await this.getEnvironment();
    await run({
      migrationsTable: "pgmigrations",
      dir: "migrations",
      direction: "up",
      databaseUrl: env.database.getConnectionString(),
    });
  }

  async runDownMigrations() {
    const env = await this.getEnvironment();
    await run({
      migrationsTable: "pgmigrations",
      dir: "migrations",
      direction: "down",
      databaseUrl: env.database.getConnectionString(),
    });
  }
}
