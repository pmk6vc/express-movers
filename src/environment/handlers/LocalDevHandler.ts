import { DatabaseConfig, ServerConfig } from "./IEnvironment";
import PostgresConfig from "../util/PostgresConfig";
import AbstractHandler from "./AbstractHandler";
import { exec } from "child_process";

export class LocalDevHandler extends AbstractHandler {
  protected getServer(): ServerConfig {
    if (this.serverConfig == undefined) {
      this.serverConfig = {
        serverPort: +process.env.PORT!,
      };
    }
    return this.serverConfig;
  }

  protected getDatabase(): DatabaseConfig {
    if (this.dbConfig == undefined) {
      this.dbConfig = new PostgresConfig(
        process.env.DB_NAME!,
        process.env.DB_HOST!,
        +process.env.DB_PORT!,
        process.env.DB_USERNAME!,
        process.env.DB_PASSWORD!
      );
    }
    return this.dbConfig;
  }

  runMigration() {
    process.env.DATABASE_URL = this.getEnvironment().database.url;
    exec(`npx prisma migrate dev --name local-dev`, {
      env: process.env,
    });
  }
}
