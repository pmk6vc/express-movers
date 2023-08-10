import AbstractHandler from "./AbstractHandler";
import run from "node-pg-migrate";

export class LocalDockerComposeHandler extends AbstractHandler {
  async runMigration() {
    const env = await this.getEnvironment();
    console.log("You've reached the local docker compose handler migration!");
    await run({
      migrationsTable: "pgmigrations",
      dir: "/app/migrations",
      direction: "up",
      databaseUrl: env.database.getConnectionString(),
    });
  }
}
