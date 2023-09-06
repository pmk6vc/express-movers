import { pgEnum } from "drizzle-orm/pg-core";

export function convertStringEnumsToPgEnum(
  pgEnumName: string,
  stringEnums: object[]
) {
  const enumValues: string[] = [];
  stringEnums.map((e) => {
    enumValues.push(...Object.values(e));
  });
  return pgEnum(pgEnumName, enumValues as [string, ...string[]]);
}
