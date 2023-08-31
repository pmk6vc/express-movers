import { Client } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Environment } from "../environment/handlers/IEnvironment";

export async function getPostgresClientFromEnv(env: Environment) {
  const client = new Client({
    connectionString: env.database.getConnectionString(),
  });
  await client.connect();
  return client;
}

export async function getDrizzleClientFromEnv(env: Environment) {
  const client = await getPostgresClientFromEnv(env);
  return drizzle(client);
}

export async function executeMigrations(
  env: Environment,
  migrationsFolderPath: string
) {
  const db = await getDrizzleClientFromEnv(env);
  await migrate(db, { migrationsFolder: migrationsFolderPath });
}
