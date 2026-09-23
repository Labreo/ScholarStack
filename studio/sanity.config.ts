import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {contextPlugin} from '@sanity/context/studio'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'ScholarStack Rulebook Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'axvnim0k',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool(),
    contextPlugin({
      insights: false, // Lean setup for hackathon evaluation
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
