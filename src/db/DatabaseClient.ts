import { Environment } from "../environment/handlers/IEnvironment";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export default class DatabaseClient {
  private static instance: DatabaseClient;
  private pool: Pool;
  pgPoolClient: NodePgDatabase;

  private constructor(pool: Pool) {
    this.pool = pool;
    this.pgPoolClient = drizzle(pool);
  }

  async runMigrations() {
    const client = await this.pool.connect();
    await migrate(drizzle(client), { migrationsFolder: "migrations" });
    client.release();
  }

  async close() {
    await this.pool.end();
  }

  static async getInstance(env: Environment) {
    if (!DatabaseClient.instance) {
      const pool = env.database.getDatabasePool();
      DatabaseClient.instance = new DatabaseClient(pool);
    }
    return DatabaseClient.instance;
  }
}
