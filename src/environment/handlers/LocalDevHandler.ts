import AbstractHandler from "./AbstractHandler";
import run from 'node-pg-migrate';

export class LocalDevHandler extends AbstractHandler {
  async runMigration() {
    const env = await this.getEnvironment();
    console.log("You've reached the local dev handler migration!")
    await run({
      migrationsTable: 'pgmigrations',
      dir: '/app/migrations',
      direction: 'up',
      databaseUrl: env.database.getConnectionString()
    });
  }
}
