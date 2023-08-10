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
  async runMigration() {
    const env = await this.getEnvironment();
    console.log("You've reached the local dev handler migration!");
    await run({
      migrationsTable: "pgmigrations",
      dir: "/app/migrations",
      direction: "up",
      databaseUrl: env.database.getConnectionString(),
    });
  }
}
