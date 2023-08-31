import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";
import PostgresConfig from "../util/PostgresConfig";
import { Client } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres/index";
import { executeMigrations } from "../../util/DatabaseUtil";

export default abstract class AbstractHandler {
  protected serverConfig?: ServerConfig;
  protected databaseConfig?: DatabaseConfig;
  protected environment?: Environment;

  abstract runMigrations(): Promise<void>;

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
