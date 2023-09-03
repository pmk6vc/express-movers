import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { Environment } from "../environment/handlers/IEnvironment";
import { roleEnum, roleTableDef } from "./model/auth/Role";

export default class DatabaseClient {
  private static instance: DatabaseClient;
  private pool: Pool;
  pgPoolClient: NodePgDatabase;

  private constructor(pool: Pool) {
    this.pool = pool;
    this.pgPoolClient = drizzle(pool);
  }

  private async seedRoles() {
    const valuesToInsert = roleEnum.enumValues.map((r) => {
      return {
        role: r,
      };
    });
    await this.pgPoolClient
      .insert(roleTableDef)
      .values(valuesToInsert)
      .onConflictDoNothing({ target: roleTableDef.role });
  }

  private async seedTables() {
    await this.seedRoles();
  }

  async runMigrations() {
    const client = await this.pool.connect();
    await migrate(drizzle(client), { migrationsFolder: "migrations" });
    client.release();
    await this.seedTables();
  }

  async close() {
    await this.pool.end();
  }

  static getInstance(env: Environment) {
    if (!DatabaseClient.instance) {
      const pool = env.database.getDatabasePool();
      DatabaseClient.instance = new DatabaseClient(pool);
    }
    return DatabaseClient.instance;
  }
}
