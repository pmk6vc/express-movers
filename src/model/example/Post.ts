import { pgTable, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { userTableDef } from "./User";
import { exampleSchema } from "./ExampleSchema";

const POST_TABLE = "post";
export const postTableDef = exampleSchema.table(POST_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: uuid("user_id").references(() => userTableDef.id),
});

export type User = typeof userTableDef.$inferSelect;
export type NewUser = typeof userTableDef.$inferInsert;
