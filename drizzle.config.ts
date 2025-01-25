import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './server/drizzle',
  schema: './api/database/mod.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: Deno.env.get('DATABASE_URL')!,
  },
})
