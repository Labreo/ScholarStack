import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'
import {verifiedSchemes} from './seedCorpus'

dotenv.config({path: path.resolve(process.cwd(), '.env')})

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_PROJECT_TOKEN

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_PROJECT_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function cleanupStaleSchemes() {
  console.log('Fetching all existing scholarshipScheme documents from Sanity...')
  const existing = await client.fetch<{_id: string; title: string; officialDocumentUrl: string}[]>(
    `*[_type == "scholarshipScheme"]{_id, title, officialDocumentUrl}`
  )

  const validIds = new Set(verifiedSchemes.map((s) => s._id))
  console.log(`Found ${existing.length} total schemes. Valid schemes count: ${validIds.size}`)

  let deletedCount = 0
  for (const doc of existing) {
    if (!validIds.has(doc._id)) {
      console.log(`[DELETING STALE] ${doc._id} -> "${doc.title}" (${doc.officialDocumentUrl})`)
      await client.delete(doc._id)
      deletedCount++
    }
  }

  console.log(`\nCleanup complete! Deleted ${deletedCount} stale/duplicate documents.`)
  console.log(`Remaining verified schemes in Sanity: ${existing.length - deletedCount}`)
}

cleanupStaleSchemes().catch((err) => {
  console.error('Cleanup failed:', err)
  process.exit(1)
})
