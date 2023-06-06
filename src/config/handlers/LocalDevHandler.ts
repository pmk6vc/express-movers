import {
  DatabaseConfig,
  ServerConfig,
} from "./IEnvironment";
import PostgresConfig from "../util/PostgresConfig";
import AbstractHandler from "./AbstractHandler";
import { exec } from "child_process";

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

  runMigration() {
    process.env.DATABASE_URL = this.getEnvironment().database.url
    exec(`npx prisma migrate dev --name local-dev`, {
      env: process.env
    })
  }
}
