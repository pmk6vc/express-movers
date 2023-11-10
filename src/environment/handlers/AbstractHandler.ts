import { Logger, createLogger, format, transports } from "winston";
import PostgresConfig from "../util/PostgresConfig";
import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";

export default abstract class AbstractHandler {
  protected serverConfig?: ServerConfig;
  protected databaseConfig?: DatabaseConfig;
  protected logger?: Logger;
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

  protected async getLogger() {
    if (!this.logger) {
      this.logger = createLogger({
        level: "info",
        transports: [
          new transports.Console({
            format: format.combine(
              format.colorize(),
              format.timestamp(),
              format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level}: ${message}`;
              })
            ),
          }),
        ],
      });
    }
    return this.logger;
  }

  async getEnvironment() {
    if (!this.environment) {
      const [serverConfig, databasePool, logger] = await Promise.all([
        this.getServerConfig(),
        this.getDatabaseConfig(),
        this.getLogger(),
      ]);
      this.environment = {
        server: serverConfig,
        database: databasePool,
        logger: logger,
      };
    }
    return this.environment;
  }
}
