import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './server/drizzle',
  schema: './server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: Deno.env.get('DATABASE_URL')!,
  },
})
