import { PostgreSqlContainer } from "@testcontainers/postgresql";
import AbstractHandler from "../../../src/environment/handlers/AbstractHandler";
import PostgresConfig from "../../../src/environment/util/PostgresConfig";
import { TEST_GCP_PROJECT_ID } from "../TestConstants";

export class TestEnvironmentHandler extends AbstractHandler {
  private static instance: TestEnvironmentHandler;
  private testDatabaseContainer: PostgreSqlContainer;

  private constructor() {
    super();
    this.testDatabaseContainer = new PostgreSqlContainer();
  }

  override async getServerConfig() {
    if (!this.serverConfig) {
      this.serverConfig = {
        serverPort: 5496,
      };
    }
    return this.serverConfig;
  }

  protected override async getDatabaseConfig() {
    if (!this.databaseConfig) {
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

  protected override async getProjectId() {
    return TEST_GCP_PROJECT_ID;
  }

  static getInstance() {
    if (!TestEnvironmentHandler.instance) {
      TestEnvironmentHandler.instance = new TestEnvironmentHandler();
    }
    return TestEnvironmentHandler.instance;
  }
}
