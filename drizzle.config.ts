import type { Config } from "drizzle-kit";

export default {
  schema: "./src/model/**/*.ts",
  out: "./migrations",
} satisfies Config;
