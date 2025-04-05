// deno-lint-ignore-file ban-unused-ignore no-explicit-any

/**
 * Converts an enum to an array of strings that can be used as an enum in
 * Drizzle.
 * @param myEnum The enum to convert.
 * @returns An array of strings that can be used as an enum in Drizzle.
 */
export const enumToSQLEnum = <T extends Record<string, string | number>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] => {
  return Object.values(myEnum).map((value: string | number) =>
    `${value}`
  ) as any
}
