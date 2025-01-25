/**
 * Converts an unknown input into a string. Numbers and booleans are converted
 * to their string representation. If conversion is not possible, returns the
 * default value.
 * @param input The input to convert to a string
 * @param defaultValue The default value to return if conversion is not possible
 * @returns The string representation of the input or the default value
 */
export const castAsString = (
  input: unknown,
  defaultValue: string = '',
): string => {
  return castAsNullableString(input, defaultValue) ?? defaultValue
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
  if (input === null || input === undefined) {
    return defaultValue
  }

  if (typeof input === 'string') {
    return input
  }

  if (typeof input === 'number' || typeof input === 'boolean') {
    return input.toString()
  }

  try {
    const stringValue = String(input)
    return stringValue
  } catch {
    return defaultValue
  }
}
