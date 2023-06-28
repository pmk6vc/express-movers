import PostgresConfig from "../util/PostgresConfig";
import AbstractHandler from "./AbstractHandler";
import { exec } from "child_process";

export class LocalDevHandler extends AbstractHandler {
  protected async getServer() {
    if (this.serverConfig == undefined) {
      this.serverConfig = {
        serverPort: +process.env.PORT!,
      };
    }
    return this.serverConfig;
  }

  protected async getDatabase() {
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

  async runMigration() {
    const env = await this.getEnvironment();
    process.env.DATABASE_URL = env.database.url;
    exec(`npx prisma migrate dev --name local-dev`, {
      env: process.env,
    });
  }
}
