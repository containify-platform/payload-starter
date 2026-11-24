import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  serverURL: process.env.PAYLOAD_PUBLIC_URL || '',
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // In development the schema is pushed as you edit collections. In
    // production the migrations in src/migrations run when the server starts:
    // after changing a collection, run `npm run migrate:create` and commit it.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
  // With ADMIN_EMAIL and ADMIN_PASSWORD set, the first user is created on
  // start when there are none, so a fresh deploy has no open sign-up page.
  onInit: async (payload) => {
    const email = process.env.ADMIN_EMAIL?.trim()
    const password = process.env.ADMIN_PASSWORD
    if (!email || !password) return
    const { totalDocs } = await payload.count({ collection: 'users' })
    if (totalDocs > 0) return
    await payload.create({ collection: 'users', data: { email, password } })
    payload.logger.info(`Created the first user, ${email}`)
  },
})
