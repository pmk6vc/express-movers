import AbstractHandler from "./AbstractHandler";
import run from "node-pg-migrate";

export class LocalDockerComposeHandler extends AbstractHandler {
  async runUpMigrations() {
    const env = await this.getEnvironment();
    await run({
      migrationsTable: "pgmigrations",
      dir: "/app/migrations",
      direction: "up",
      databaseUrl: env.database.getConnectionString(),
    });
  }

  async runDownMigrations() {
    const env = await this.getEnvironment();
    await run({
      migrationsTable: "pgmigrations",
      dir: "/app/migrations",
      direction: "down",
      databaseUrl: env.database.getConnectionString(),
    });
  }
}
