import { sql } from "drizzle-orm";
import { uuid, varchar } from "drizzle-orm/pg-core";
import { exampleSchema } from "./ExampleSchema";

const DUMMY_USER_TABLE = "dummy_user";
export const dummyUserTableDef = exampleSchema.table(DUMMY_USER_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique(),
});

export type DummyUser = typeof dummyUserTableDef.$inferSelect;
export type NewDummyUser = typeof dummyUserTableDef.$inferInsert;
