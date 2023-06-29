import AbstractHandler from "./AbstractHandler";
import { exec } from "child_process";

export class ProductionHandler extends AbstractHandler {
  async runMigration() {
    const env = await this.getEnvironment();
    process.env.DATABASE_URL = env.database.getConnectionString();
    await exec(`npx prisma migrate deploy`, {
      env: process.env,
    });
  }
}
