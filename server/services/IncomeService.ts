import { db, IncomeSchema } from '../db/index.ts'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'npm:zod'
import { generateId } from '../utils/generateId.ts'
import { IncomeStatus } from '@personal-finance/api'
import { eq } from 'drizzle-orm'

const SelectIncomeSchemaDB = createSelectSchema(IncomeSchema)

export type Income = z.TypeOf<typeof SelectIncomeSchemaDB>

const InsertIncomeSchemaDB = createInsertSchema(IncomeSchema, {
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

const InsertServiceSchema = InsertIncomeSchemaDB.omit({ id: true })

export type InsertIncomeSchemaType = z.TypeOf<typeof InsertServiceSchema>

export const createIncome = async (income: InsertIncomeSchemaType) => {
  const now = Date.now()
  const DEFAULT: Income = {
    id: generateId(),
    name: '',
    description: null,
    status: IncomeStatus.Planned,
    plannedAmount: '0.0',
    actualAmount: null,
    plannedPayDate: now,
    updatedAt: now,
    completedAt: null,
    actualPayDate: null,
    createdAt: Date.now(),
    budgetId: income.budgetId,
  }

  const input: Income = {
    ...DEFAULT,
    ...income,
  }

  const result = await db.insert(IncomeSchema).values(input).returning()

  return result[0]
}

export const getIncomes = async () => {
  return await db.select().from(IncomeSchema)
}

/**
 * Updates an existing income.
 * @param id The ID of the income to update
 * @param income The income properties to update
 */
export const updateIncome = async (
  id: string,
  income: Partial<InsertIncomeSchemaType>,
): Promise<Income> => {
  const result = await db
    .update(IncomeSchema)
    .set(income)
    .where(eq(IncomeSchema.id, id))
    .returning()

  return result[0]
}

/**
 * Gets a single income by ID.
 * @param id The ID of the income to retrieve
 */
export const getIncome = async (id: string) => {
  return await db.query.Income.findFirst({
    where: eq(IncomeSchema.id, id),
  })
}

/**
 * Deletes an existing income.
 * @param id The ID of the income to delete
 * @throws Error if income with given ID does not exist
 */
export const deleteIncome = async (id: string): Promise<void> => {
  // First check if income exists
  const existing = await db
    .select()
    .from(IncomeSchema)
    .where(eq(IncomeSchema.id, id))
    .limit(1)

  if (!existing.length) {
    throw new Error(`Income with ID ${id} not found`)
  }

  await db
    .delete(IncomeSchema)
    .where(eq(IncomeSchema.id, id))
}
