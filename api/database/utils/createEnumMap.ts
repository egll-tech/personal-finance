/**
 * Utility that converts an array of unique strings into a map. Provides a
 * behavior similar to enums.
 * @param values Array of unique strings that will be parsed as an pseudo enum.
 */
export const createEnumMap = <
  const T extends readonly string[],
>(values: T) => {
  return Object.fromEntries(
    values.map((v) => [v.toUpperCase(), v]),
  ) as { [K in Uppercase<T[number]>]: T[number] }
}
