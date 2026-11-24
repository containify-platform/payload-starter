import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Mount a volume here in production, or uploads are lost on redeploy.
    staticDir: process.env.MEDIA_DIR || 'media',
  },
}
