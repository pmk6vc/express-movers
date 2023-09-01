import { sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import DatabaseClient from "../../src/db/DatabaseClient";

export async function truncateTables(
  dbClient: DatabaseClient,
  tableDefs: PgTable[]
) {
  const db = dbClient.pgPoolClient;
  await Promise.all(
    tableDefs.map((t) => {
      return db.execute(sql`TRUNCATE ${t} CASCADE`);
    })
  );
}
