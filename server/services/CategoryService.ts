import { CategorySchema, db } from '../db/index.ts'
import { generateId } from '../utils/generateId.ts'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'npm:zod'
import { eq } from 'drizzle-orm'

/**
 * Schema from the DB. Objects should always match this.
 */
const SelectCategorySchemaDB = createSelectSchema(CategorySchema)

/**
 * Exports type to be used by any consumer of the service.
 */
export type Category = z.TypeOf<typeof SelectCategorySchemaDB>

/**
 * Overrides the DB schema, indicating which fields are optional for the
 * service.
 */
const InsertCategorySchemaDB = createInsertSchema(CategorySchema)

/**
 * Disables ID to be generated automatically.
 */
const InsertServiceSchema = InsertCategorySchemaDB.omit({ id: true })

/**
 * Exports type to be used by any consumer of the service.
 */
export type InsertCategorySchemaType = z.TypeOf<typeof InsertServiceSchema>

/**
 * Retrieves all categories.
 */
export const getCategories = async () => {
  return await db.select().from(CategorySchema)
}

/**
 * Gets a single category by ID.
 * @param id The ID of the category to retrieve
 */
export const getCategory = async (id: string) => {
  return await db.query.Category.findFirst({
    where: eq(CategorySchema.id, id),
  })
}

/**
 * Creates a new category.
 * @param category Object for the category to create.
 */
export const createCategory = async (
  category: InsertCategorySchemaType,
): Promise<Category> => {
  const DEFAULT: Category = {
    id: generateId(),
    name: '',
    description: null,
  }

  const value: Category = {
    ...DEFAULT,
    ...category,
  }

  const result = await db.insert(CategorySchema).values(value).returning()

  return result[0]
}

/**
 * Updates an existing category.
 * @param id The ID of the category to update
 * @param category The category properties to update
 */
export const updateCategory = async (
  id: string,
  category: Partial<InsertCategorySchemaType>,
): Promise<Category> => {
  const result = await db
    .update(CategorySchema)
    .set(category)
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

  await db.delete(CategorySchema).where(eq(CategorySchema.id, id))
}
