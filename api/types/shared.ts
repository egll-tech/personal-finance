import { z } from 'zod'

export const currencyZod = z.string().regex(/^\d+(\.\d{2})?$/, {
  message: "Value must be a valid currency string (e.g. '100.00')",
})
