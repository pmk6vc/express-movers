import { Client } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Environment } from "../environment/handlers/IEnvironment";

export async function getMigrationClient(env: Environment) {
  const client = new Client({
    connectionString: env.database.getConnectionString()
  })
  await client.connect()
  return client
}

export async function executeMigrations(env: Environment, migrationsFolderPath: string) {
  const client = await getMigrationClient(env)
  await migrate(drizzle(client), { migrationsFolder: migrationsFolderPath })
}