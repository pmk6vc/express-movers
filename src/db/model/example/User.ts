import { sql } from "drizzle-orm";
import { uuid, varchar } from "drizzle-orm/pg-core";
import { exampleSchema } from "./ExampleSchema";

// TODO: Try creating another table with the same name in a different schema
const USER_TABLE = "user";
export const userTableDef = exampleSchema.table(USER_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique(),
});

export type User = typeof userTableDef.$inferSelect;
export type NewUser = typeof userTableDef.$inferInsert;
