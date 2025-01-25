import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from 'npm:@libsql/client/node'
import {
  BudgetSchema,
  CategorySchema,
  ExpenseSchema,
  IncomeSchema,
} from '@personal-finance/api'

const client = createClient({ url: Deno.env.get('DATABASE_URL')! })

export const DatabaseService = drizzle({
  schema: {
    BudgetSchema,
    CategorySchema,
    ExpenseSchema,
    IncomeSchema,
  },
  client,
})
