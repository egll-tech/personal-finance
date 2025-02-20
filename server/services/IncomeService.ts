import {
  IncomeSchema,
  IncomeSchemaStatus,
  type InsertIncomeSchemaType,
  type SelectIncomeSchemaType,
} from '@personal-finance/api'
import { eq } from 'drizzle-orm'
import {
  cast,
  castAsDate,
  castAsNullableDate,
  castAsNullableString,
  castAsString,
} from '../utils/cast.ts'
import { generateId } from '../utils/generateId.ts'
import { DatabaseService } from './DatabaseService.ts'

export const createIncome = async (income: InsertIncomeSchemaType) => {
  const value = {
    id: castAsString(income.id, generateId()),
    name: castAsString(income.name),
    description: castAsNullableString(income.description),
    status: cast<IncomeSchemaStatus, IncomeSchemaStatus>(
      income.status,
      IncomeSchemaStatus.PLANNED,
    ),
    plannedAmount: castAsString(income.plannedAmount, '0.0'),
    actualAmount: castAsString(income.actualAmount),
    plannedPayDate: castAsDate(income.plannedPayDate),
    updatedAt: castAsDate(income.updatedAt),
    completedAt: castAsNullableDate(income.completedAt),
    actualPayDate: castAsNullableDate(income.actualPayDate),
    createdAt: castAsDate(income.createdAt),
    budgetId: castAsString(income.budgetId),
  }

  const result = await DatabaseService.insert(IncomeSchema).values(value)
    .returning()

  return result[0]
}

export const getIncomes = async () => {
  return await DatabaseService.select().from(IncomeSchema)
}

/**
 * Updates an existing income.
 * @param id The ID of the income to update
 * @param income The income properties to update
 */
export const updateIncome = async (
  id: string,
  income: Partial<InsertIncomeSchemaType>,
): Promise<SelectIncomeSchemaType> => {
  const updateData = {
    name: castAsString(income.name),
    description: castAsNullableString(income.description),
    status: cast<IncomeSchemaStatus, IncomeSchemaStatus>(
      income.status,
      IncomeSchemaStatus.PLANNED,
    ),
    plannedAmount: castAsString(income.plannedAmount),
    actualAmount: castAsNullableString(income.actualAmount),
    plannedPayDate: castAsDate(income.plannedPayDate),
    updatedAt: castAsDate(income.updatedAt),
    completedAt: castAsNullableDate(income.completedAt),
    actualPayDate: castAsNullableDate(income.actualPayDate),
    createdAt: castAsDate(income.createdAt),
    budgetId: castAsString(income.budgetId),
  }

  const result = await DatabaseService
    .update(IncomeSchema)
    .set(updateData)
    .where(eq(IncomeSchema.id, id))
    .returning()

  return result[0]
}

/**
 * Gets a single income by ID.
 * @param id The ID of the income to retrieve
 */
export const getIncome = async (id: string) => {
  return await DatabaseService.query.IncomeSchema.findFirst({
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
  const existing = await DatabaseService
    .select()
    .from(IncomeSchema)
    .where(eq(IncomeSchema.id, id))
    .limit(1)

  if (!existing.length) {
    throw new Error(`Income with ID ${id} not found`)
  }

  await DatabaseService
    .delete(IncomeSchema)
    .where(eq(IncomeSchema.id, id))
}
