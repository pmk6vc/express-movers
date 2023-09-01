import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { dummyUserTableDef } from "./DummyUser";
import { exampleSchema } from "./ExampleSchema";

const DUMMY_POST_TABLE = "dummy_post";
export const dummyPostTableDef = exampleSchema.table(DUMMY_POST_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: uuid("user_id").references(() => dummyUserTableDef.id),
});

export type DummyPost = typeof dummyPostTableDef.$inferSelect;
export type NewDummyPost = typeof dummyPostTableDef.$inferInsert;
