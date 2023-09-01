import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/model/**/*.ts",
  out: "./migrations",
} satisfies Config;
