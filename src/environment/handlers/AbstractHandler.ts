import PostgresConfig from "../util/PostgresConfig";
import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";

export default abstract class AbstractHandler {
  protected serverConfig?: ServerConfig;
  protected databaseConfig?: DatabaseConfig;
  protected environment?: Environment;

  protected async getServerConfig() {
    if (!this.serverConfig) {
      this.serverConfig = {
        serverPort: +process.env.PORT!,
      };
    }
    return this.serverConfig;
  }

  protected async getDatabaseConfig() {
    if (!this.databaseConfig) {
      this.databaseConfig = new PostgresConfig(
        process.env.DB_USERNAME!,
        process.env.DB_PASSWORD!,
        process.env.DB_HOST!,
        +process.env.DB_PORT!,
        process.env.DB_NAME!
      );
    }
    return this.databaseConfig;
  }

  async getEnvironment() {
    if (!this.environment) {
      const [serverConfig, databasePool] = await Promise.all([
        this.getServerConfig(),
        this.getDatabaseConfig(),
      ]);
      this.environment = {
        server: serverConfig,
        database: databasePool,
      };
    }
    return this.environment;
  }
}
