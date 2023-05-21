import {
  DatabaseConfig,
  Environment,
  EnvironmentHandler,
  ServerConfig,
} from "./IEnvironment";
import { IConfig } from "config";
import PostgresConfig from "../util/PostgresConfig";

export class LocalDevHandler implements EnvironmentHandler {
  private getServer(): ServerConfig {
    return {
      serverPort: +process.env.PORT!,
    };
  }

  private getDatabase(): DatabaseConfig {
    return new PostgresConfig(
      process.env.DB_NAME!,
      process.env.DB_HOST!,
      +process.env.DB_PORT!,
      process.env.DB_USERNAME!,
      process.env.DB_PASSWORD!,
    );
  }

  getEnvironment(config: IConfig): Environment {
    return {
      server: this.getServer(),
      database: this.getDatabase(),
    };
  }
}
