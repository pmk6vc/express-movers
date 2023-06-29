import AbstractHandler from "./AbstractHandler";
import { exec } from "child_process";

export class LocalDevHandler extends AbstractHandler {
  async runMigration() {
    const env = await this.getEnvironment();
    process.env.DATABASE_URL = env.database.getConnectionString();
    await exec(`npx prisma migrate dev --name local-dev`, {
      env: process.env,
    });
  }
}
