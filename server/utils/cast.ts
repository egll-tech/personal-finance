export const cast = <T = string, U = null>(
  input: unknown,
  defaultValue: U,
): T | U => {
  if (input === null || input === undefined) {
    return defaultValue
  }

  return input as T
}

export const castAsBoolean = (
  input: unknown,
  defaultValue = false,
): boolean => {
  return cast<boolean, boolean>(input, defaultValue)
}

export const castAsNumber = (input: unknown, defaultValue = 0): number => {
  return cast<number, number>(input, defaultValue)
}

export const castAsDate = (input: unknown, defaultValue = new Date()): Date => {
  if (typeof input === 'string') {
    return new Date(input)
  }
  return cast<Date, Date>(input, defaultValue)
}

export const castAsNullableDate = (
  input: unknown,
  defaultValue: Date | null = null,
): Date | null => {
  return cast<Date | null, Date | null>(input, defaultValue)
}

/**
 * Converts an unknown input into a string. Numbers and booleans are converted
 * to their string representation. If conversion is not possible, returns the
 * default value.
 * @param input The input to convert to a string
 * @param defaultValue The default value to return if conversion is not possible
 * @returns The string representation of the input or the default value
 */
export const castAsString = (input: unknown, defaultValue = ''): string => {
  return cast<string, string>(input, defaultValue)
}

/**
 * Converts an unknown input into a nullable string. Numbers and booleans are
 * converted to their string representation. If conversion is not possible,
 * returns the default value.
 * @param input The input to convert to a string
 * @param defaultValue The default value to return if conversion is not possible
 * @returns The string representation of the input or the default value
 */
export const castAsNullableString = (
  input: unknown,
  defaultValue: string | null = null,
): string | null => {
  return cast<string | null, string | null>(input, defaultValue)
}
