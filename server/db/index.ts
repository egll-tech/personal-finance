import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from 'npm:@libsql/client/node'

const client = createClient({ url: Deno.env.get('DATABASE_URL')! })
export const db = drizzle({ client })

export * from './schema.ts'
