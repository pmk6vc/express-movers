import { PgTable } from "drizzle-orm/pg-core";
import DatabaseClient from "../../src/db/DatabaseClient";

export async function truncateTables(
  dbClient: DatabaseClient,
  tableDefs: PgTable[]
) {
  await Promise.all(
    tableDefs.map((t) => {
      return dbClient.pgPoolClient.delete(t);
    })
  );
}
