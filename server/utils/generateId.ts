import { customAlphabet } from 'npm:nanoid'

const CUSTOM_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const nanoid = customAlphabet(CUSTOM_ALPHABET, 7)

/**
 * Creates ID to be used in the application.
 */
export const generateId = (): string => {
  return nanoid()
}
