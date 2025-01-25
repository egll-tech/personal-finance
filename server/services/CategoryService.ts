import {
  CategorySchema,
  InsertCategorySchemaParser,
  type InsertCategorySchemaType,
  type SelectCategorySchemaType,
} from '@personal-finance/api'
import { eq } from 'drizzle-orm'
import { generateId } from '../utils/generateId.ts'
import { DatabaseService } from './DatabaseService.ts'
import { castAsNullableString, castAsString } from '../utils/castAsString.ts'

/**
 * Retrieves all categories.
 */
export const getCategories = async () => {
  return await DatabaseService.select().from(CategorySchema)
}

/**
 * Gets a single category by ID.
 * @param id The ID of the category to retrieve
 */
export const getCategory = async (id: string) => {
  return await DatabaseService.query.CategorySchema.findFirst({
    where: eq(CategorySchema.id, id),
  })
}

/**
 * Creates a new category.
 * @param category Object for the category to create.
 */
export const createCategory = async (
  category: InsertCategorySchemaType,
): Promise<SelectCategorySchemaType> => {
  const parsed = InsertCategorySchemaParser.parse(category)

  const value = {
    id: generateId(),
    name: castAsString(parsed.name),
    description: castAsNullableString(parsed.description),
  }

  const result = await DatabaseService.insert(CategorySchema)
    .values(value)
    .returning()

  return result[0]
}

/**
 * Updates an existing category.
 * @param id The ID of the category to update
 * @param category The category properties to update
 */
export const updateCategory = async (
  id: string,
  category: InsertCategorySchemaType,
): Promise<SelectCategorySchemaType> => {
  const updateData: { name: string; description?: string | null } = {
    name: category.name?.toString() ?? '',
    description: category.description?.toString() ?? null,
  }

  const result = await DatabaseService
    .update(CategorySchema)
    .set(updateData)
    .where(eq(CategorySchema.id, id))
    .returning()

  return result[0]
}

/**
 * Deletes an existing category.
 * @param id The ID of the category to delete
 */
export const deleteCategory = async (id: string): Promise<void> => {
  const category = await getCategory(id)
  if (!category) {
    throw new Error(`Category with ID ${id} not found`)
  }

  await DatabaseService.delete(CategorySchema).where(eq(CategorySchema.id, id))
}
