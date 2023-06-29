import AbstractHandler from "./AbstractHandler";
import { exec } from "child_process";

export class ProductionHandler extends AbstractHandler {
  async runMigration() {
    const env = await this.getEnvironment();
    process.env.DATABASE_URL = env.database.getConnectionString();
    console.log(`Running migrate command with this DATABASE_URL: ${process.env.DATABASE_URL}`);
    await exec(`prisma migrate deploy`, {
      env: process.env,
    });
  }
}
