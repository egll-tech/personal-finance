import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from 'npm:@libsql/client/node'
import {
  BudgetRelations,
  BudgetSchema,
  CategoryRelations,
  CategorySchema,
  ExpenseRelations,
  ExpenseSchema,
  ExpenseToCategorySchema,
  IncomeRelations,
  IncomeSchema,
} from '@personal-finance/api'

const client = createClient({ url: Deno.env.get('DATABASE_URL')! })

export const DatabaseService = drizzle({
  schema: {
    // Tables
    BudgetSchema,
    CategorySchema,
    ExpenseSchema,
    IncomeSchema,

    // Relations
    BudgetRelations,
    CategoryRelations,
    ExpenseRelations,
    IncomeRelations,

    // Many to many relations
    ExpenseToCategorySchema,
  },
  client,
})
