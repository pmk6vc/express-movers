import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { Environment } from "../environment/handlers/IEnvironment";
import {
  permissionsPgEnum,
  permissionsTableDef,
} from "./model/auth/Permissions";
import { rolesPgEnum, rolesTableDef } from "./model/auth/Roles";

export default class DatabaseClient {
  private static instance: DatabaseClient;
  private pool: Pool;
  pgPoolClient: NodePgDatabase;

  private constructor(pool: Pool) {
    this.pool = pool;
    this.pgPoolClient = drizzle(pool);
  }

  private async seedRoles() {
    const valuesToInsert = rolesPgEnum.enumValues.map((r) => {
      return {
        role: r,
      };
    });
    await this.pgPoolClient
      .insert(rolesTableDef)
      .values(valuesToInsert)
      .onConflictDoNothing();
  }

  private async seedPermissions() {
    const valuesToInsert = permissionsPgEnum.enumValues.map((p) => {
      return {
        permission: p,
      };
    });
    await this.pgPoolClient
      .insert(permissionsTableDef)
      .values(valuesToInsert)
      .onConflictDoNothing();
  }

  // TODO: Need to thoroughly test seeding database tables - values, conflicts, enum integrity
  private async seedTables() {
    await Promise.all([this.seedRoles(), this.seedPermissions()]);
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
