import { Environment } from "../../src/environment/handlers/IEnvironment";
import { PgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { getMigrationClient } from "../../src/util/MigrationUtil";
import { sql } from "drizzle-orm";

export async function truncateTables(env: Environment, tableDefs: PgTable[]) {
  const client = await getMigrationClient(env)
  const db = drizzle(client)
  await Promise.all(
    tableDefs.map(t => { return db.execute(sql`TRUNCATE ${t} CASCADE`) })
  )
}