import { pgEnum } from "drizzle-orm/pg-core";

export function getStringEnumsValues(stringEnums: Object[]) {
  const enumValues: string[] = [];
  stringEnums.map((e) => {
    enumValues.push(...Object.values(e));
  });
  return enumValues;
}

export function convertStringEnumsToPgEnum(
  pgEnumName: string,
  stringEnums: Object[]
) {
  return pgEnum(
    pgEnumName,
    getStringEnumsValues(stringEnums) as [string, ...string[]]
  );
}
