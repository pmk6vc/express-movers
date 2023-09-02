import { PostgreSqlContainer } from "@testcontainers/postgresql";
import PostgresConfig from "../util/PostgresConfig";
import AbstractHandler from "./AbstractHandler";

export class LocalDevHandler extends AbstractHandler {
  private static instance: LocalDevHandler;

  private constructor() {
    super();
  }

  protected override async getServerConfig() {
    if (!this.serverConfig) {
      this.serverConfig = {
        serverPort: 5495,
      };
    }
    return this.serverConfig;
  }

  protected override async getDatabaseConfig() {
    if (!this.databaseConfig) {
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

  static getInstance() {
    if (!LocalDevHandler.instance) {
      LocalDevHandler.instance = new LocalDevHandler();
    }
    return LocalDevHandler.instance;
  }
}
