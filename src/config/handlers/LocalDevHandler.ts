import {
  DatabaseConfig,
  Environment,
  ServerConfig,
} from "./IEnvironment";
import PostgresConfig from "../util/PostgresConfig";
import AbstractHandler from "./AbstractHandler";

export class LocalDevHandler extends AbstractHandler {
  protected getServer(): ServerConfig {
    return {
      serverPort: +process.env.PORT!,
    };
  }

  protected getDatabase(): DatabaseConfig {
    return new PostgresConfig(
      process.env.DB_NAME!,
      process.env.DB_HOST!,
      +process.env.DB_PORT!,
      process.env.DB_USERNAME!,
      process.env.DB_PASSWORD!
    );
  }

  getEnvironment(): Environment {
    return {
      server: this.getServer(),
      database: this.getDatabase(),
    };
  }
}
