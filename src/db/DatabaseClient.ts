import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { Environment } from "../environment/handlers/IEnvironment";
import {
  permissionsPgEnum,
  permissionsTableDef,
} from "./model/entity/Permissions";
import { rolesPgEnum, rolesTableDef } from "./model/entity/Roles";
import {
  NewRolePermission,
  rolesPermissionsMap,
  rolesPermissionsTableDef,
} from "./model/entity/RolesPermissions";

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

  private async seedRolesPermissions() {
    const valuesToInsert: NewRolePermission[] = [];
    const [roles, permissions] = await Promise.all([
      this.pgPoolClient.select().from(rolesTableDef),
      this.pgPoolClient.select().from(permissionsTableDef),
    ]);
    const rolesMap = new Map(roles.map((r) => [r.role.toString(), r.id]));
    const permissionsMap = new Map(
      permissions.map((p) => [p.permission.toString(), p.id])
    );
    rolesPermissionsMap.forEach((associatedPermissions, role) => {
      associatedPermissions.map((permission) => {
        valuesToInsert.push({
          roleId: rolesMap.get(role.toString())!,
          permissionId: permissionsMap.get(permission.toString())!,
        });
      });
    });
    await this.pgPoolClient
      .insert(rolesPermissionsTableDef)
      .values(valuesToInsert)
      .onConflictDoNothing();
  }

  private async seedTables() {
    await Promise.all([this.seedRoles(), this.seedPermissions()]);
    await this.seedRolesPermissions();
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
