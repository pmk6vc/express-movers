import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";
import PostgresConfig from "../util/PostgresConfig";

export default abstract class AbstractHandler {
  protected serverConfig?: ServerConfig;
  protected databaseConfig?: DatabaseConfig;
  protected environment?: Environment;

  abstract runMigration(): Promise<void>;

  protected async getServerConfig() {
    if (this.serverConfig == undefined) {
      this.serverConfig = {
        serverPort: +process.env.PORT!,
      };
    }
    return this.serverConfig;
  }

  protected async getDatabaseConfig() {
    if (this.databaseConfig == undefined) {
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
    if (this.environment == undefined) {
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
