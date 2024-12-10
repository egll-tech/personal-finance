import { assertExists, assertStrictEquals } from '@std/assert'
import {
  type Category,
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from './CategoryService.ts'

Deno.test({
  name: 'can create, get, update and delete category',
  permissions: { env: true, ffi: true },
}, async (t) => {
  let createdCategory: Category | undefined = undefined

  await t.step('create category', async () => {
    const name = 'Test Category'
    const description = 'Test Description'

    createdCategory = await createCategory({
      name,
      description,
    })

    assertExists(createdCategory)
    assertStrictEquals(createdCategory.name, name)
    assertStrictEquals(createdCategory.description, description)
  })

  await t.step('get single category', async () => {
    const retrievedCategory = await getCategory(createdCategory!.id)
    assertExists(retrievedCategory)
    assertStrictEquals(retrievedCategory.id, createdCategory!.id)
  })

  await t.step('update category', async () => {
    const updatedName = 'Updated Category Name'
    const updatedDescription = 'Updated Description'

    const result = await updateCategory(createdCategory!.id, {
      name: updatedName,
      description: updatedDescription,
    })

    assertExists(result)
    assertStrictEquals(result.name, updatedName)
    assertStrictEquals(result.description, updatedDescription)
  })

  await t.step('get all categories', async () => {
    const allCategories = await getCategories()
    assertExists(allCategories)
    assertStrictEquals(allCategories.length >= 1, true)
  })

  await t.step('delete category', async () => {
    await deleteCategory(createdCategory!.id)
    const deletedCategory = await getCategory(createdCategory!.id)
    assertStrictEquals(deletedCategory, undefined)
  })
})

Deno.test({
  name: 'deleting non-existent category throws error',
  permissions: { env: true, ffi: true },
}, async () => {
  const nonExistentId = 'non-existent-id'

  try {
    await deleteCategory(nonExistentId)
    throw new Error('Should have thrown error for non-existent category')
  } catch (error: unknown) {
    assertStrictEquals(
      (error as Error).message,
      `Category with ID ${nonExistentId} not found`,
    )
  }
})
