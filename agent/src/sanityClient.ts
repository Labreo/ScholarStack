import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({path: path.resolve(process.cwd(), '.env')})

const projectId = process.env.SANITY_PROJECT_ID || 'axvnim0k'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_PROJECT_TOKEN

export const sanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

export interface StackingRule {
  hasNonStackingRestriction: boolean
  exactClauseText: string
  clauseReference: string
  consequenceOfViolation: string
  allowedExceptions: string
}

export interface ScholarshipScheme {
  _id: string
  _type: 'scholarshipScheme'
  title: string
  slug: {current: string}
  authority: string
  category: 'central' | 'state' | 'institute' | 'corporate'
  officialDocumentUrl: string
  documentTitle: string
  summary: string
  benefits: string
  stackingRule: StackingRule
}

export interface StudentDecision {
  _id: string
  _type: 'studentDecision'
  studentId: string
  retainedScheme: {_ref: string; title?: string}
  surrenderedScheme: {_ref: string; title?: string}
  resolutionStatus: string
  resolvedAt: string
  decisionNotes: string
}

let cachedSchemes: ScholarshipScheme[] | null = null
let schemesCacheTime = 0
const SCHEMES_CACHE_TTL = 60 * 1000

/**
 * Fetch all verified scholarship schemes from Sanity Content Lake
 */
export async function getAllSchemes(): Promise<ScholarshipScheme[]> {
  const now = Date.now()
  if (cachedSchemes && (now - schemesCacheTime < SCHEMES_CACHE_TTL)) {
    return cachedSchemes
  }
  try {
    const schemes = await sanityClient.fetch<ScholarshipScheme[]>(
      `*[_type == "scholarshipScheme"] | order(title asc)`
    )
    if (schemes && schemes.length > 0) {
      cachedSchemes = schemes
      schemesCacheTime = now
      return schemes
    }
    return cachedSchemes || []
  } catch (err) {
    if (cachedSchemes) return cachedSchemes
    throw err
  }
}

/**
 * Fetch all recorded decisions for a specific student
 */
export async function getStudentDecisions(studentId: string): Promise<StudentDecision[]> {
  return await sanityClient.fetch<StudentDecision[]>(
    `*[_type == "studentDecision" && studentId == $studentId] | order(resolvedAt desc) {
      _id,
      _type,
      studentId,
      retainedScheme->{_id, title},
      surrenderedScheme->{_id, title},
      resolutionStatus,
      resolvedAt,
      decisionNotes
    }`,
    {studentId}
  )
}

/**
 * Record a resolution decision in Sanity (Section 4 Differentiator)
 */
export async function recordStudentDecision(params: {
  studentId: string
  retainedSchemeId: string
  surrenderedSchemeId: string
  decisionNotes?: string
}) {
  const doc = {
    _type: 'studentDecision',
    studentId: params.studentId,
    retainedScheme: {
      _type: 'reference',
      _ref: params.retainedSchemeId,
    },
    surrenderedScheme: {
      _type: 'reference',
      _ref: params.surrenderedSchemeId,
    },
    resolutionStatus: 'resolved',
    resolvedAt: new Date().toISOString(),
    decisionNotes:
      params.decisionNotes ||
      `Student chose to retain ${params.retainedSchemeId} and formally surrendered ${params.surrenderedSchemeId}.`,
  }

  const created = await sanityClient.create(doc)
  return created
}
