import AbstractHandler from "../../src/environment/handlers/AbstractHandler";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import PostgresConfig from "../../src/environment/util/PostgresConfig";
import run from "node-pg-migrate";

export class TestEnvironmentHandler extends AbstractHandler {
  testDatabaseContainer = new PostgreSqlContainer()

  override async getServerConfig() {
    if (this.serverConfig == undefined) {
      this.serverConfig = {
        serverPort: 1,
      };
    }
    return this.serverConfig;
  }

  protected override async getDatabaseConfig() {
    const startedContainer = await this.testDatabaseContainer.start()
    if (this.databaseConfig == undefined) {
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

  async runMigration() {
    const env = await this.getEnvironment();
    console.log("You've reached the test handler migration!");
    await run({
      migrationsTable: "pgmigrationstest",
      dir: "migrations",
      direction: "up",
      databaseUrl: env.database.getConnectionString(),
    });
  }
}