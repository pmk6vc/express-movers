import AbstractHandler from "../../../src/environment/handlers/AbstractHandler";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import PostgresConfig from "../../../src/environment/util/PostgresConfig";
import run from "node-pg-migrate";
import { executeMigrations } from "../../../src/util/MigrationUtil";

export class TestEnvironmentHandler extends AbstractHandler {
  testDatabaseContainer = new PostgreSqlContainer();

  override async getServerConfig() {
    if (this.serverConfig == undefined) {
      this.serverConfig = {
        serverPort: 5496,
      };
    }
    return this.serverConfig;
  }

  protected override async getDatabaseConfig() {
    if (this.databaseConfig == undefined) {
      const startedContainer = await this.testDatabaseContainer.start();
      this.databaseConfig = new PostgresConfig(
        startedContainer.getUsername(),
        startedContainer.getPassword(),
        startedContainer.getHost(),
        startedContainer.getPort(),
        startedContainer.getDatabase()
      );
    }
    return this.databaseConfig;
  }

  async runMigrations() {
    const env = await this.getEnvironment();
    await executeMigrations(env, "migrations");
  }
}
