import {
  DatabaseConfig,
  Environment,
  EnvironmentHandler,
  ServerConfig,
} from "./IEnvironment";
import { IConfig } from "config";

export class LocalDevHandler implements EnvironmentHandler {
  private getServer(): ServerConfig {
    return {
      serverPort: +process.env.PORT!,
    };
  }

  private getDatabase(): DatabaseConfig {
    return {
      database: process.env.DB_NAME!,
      host: process.env.DB_HOST!,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
    };
  }

  getEnvironment(config: IConfig): Environment {
    return {
      server: this.getServer(),
      database: this.getDatabase(),
    };
  }
}
