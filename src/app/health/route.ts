import configPromise from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

// Health check: Payload is initialised (migrations ran) and Postgres answers.
export const GET = async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    await payload.db.drizzle.execute(sql`select 1`)
    return Response.json({ status: 'ok' })
  } catch (err) {
    console.error('health check failed', err)
    return Response.json({ status: 'error' }, { status: 503 })
  }
}
