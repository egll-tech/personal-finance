import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const CategorySchema = sqliteTable('Category', {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
})
