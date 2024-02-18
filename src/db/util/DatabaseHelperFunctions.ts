import { pgEnum } from "drizzle-orm/pg-core";

export function convertStringEnumToPgEnum(
  pgEnumName: string,
  stringEnum: object,
) {
  const enumValues: string[] = [];
  enumValues.push(...Object.values(stringEnum));
  return pgEnum(pgEnumName, enumValues as [string, ...string[]]);
}
