import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { exampleSchema } from "./ExampleSchema";
import { userTableDef } from "./User";

const POST_TABLE = "post";
export const postTableDef = exampleSchema.table(POST_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: uuid("user_id").references(() => userTableDef.id),
});

export type Post = typeof postTableDef.$inferSelect;
export type NewPost = typeof postTableDef.$inferInsert;
