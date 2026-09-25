import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Courses } from './payload/collections/Courses.ts'
import { Users } from './payload/collections/Users.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: '— QL Learn Admin',
      icons: [{ rel: 'icon', url: '/favicon.png' }],
    },
    components: {
      graphics: {
        Logo: '/payload/admin/Logo#Logo',
        Icon: '/payload/admin/Icon#Icon',
      },
    },
  },
  collections: [Users, Courses],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    // Serverless functions each hold a pool; keep it small (PRD §4.10).
    connectOptions: { maxPoolSize: 10 },
  }),
  sharp,
})
