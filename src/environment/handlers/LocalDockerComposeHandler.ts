import AbstractHandler from "./AbstractHandler";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export class LocalDockerComposeHandler extends AbstractHandler {
  async runMigrations() {
    const env = await this.getEnvironment();
    const client = new Client({
      connectionString: env.database.getConnectionString(),
    });
    await client.connect();
    await migrate(drizzle(client), { migrationsFolder: "/app/migrations" });
  }
}
