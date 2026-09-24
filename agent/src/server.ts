import express from 'express'
import cors from 'cors'
import * as path from 'path'
import * as dotenv from 'dotenv'
import {getAllSchemes, getStudentDecisions, recordStudentDecision} from './sanityClient'
import {evaluateStackingQuery} from './evaluator'
import {contextMcpClient} from './contextMcpClient'

dotenv.config({path: path.resolve(process.cwd(), '.env')})

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Serve static frontend files
const publicDir = path.resolve(process.cwd(), 'web/public')
app.use(express.static(publicDir))

// 1. Health & Context MCP Status
app.get('/api/status', async (req, res) => {
  try {
    const mcpStatus = await contextMcpClient.listTools()
    res.json({
      status: 'online',
      sanity: {
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
        studioUrl: 'https://scholarstack-rules.sanity.studio',
        contextMcp: {
          endpoint: process.env.SANITY_MCP_URL,
          connected: mcpStatus.connected,
          tools: mcpStatus.tools,
          message: mcpStatus.message,
        },
      },
      modelProvider: 'Google Gemini (gemini-2.5-flash)',
    })
  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
})

// 2. List all verified schemes from Sanity Content Lake
app.get('/api/schemes', async (req, res) => {
  try {
    const schemes = await getAllSchemes()
    res.json({schemes})
  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
})

// 3. Evaluate student question
app.post('/api/evaluate', async (req, res) => {
  try {
    const {question, studentId = 'student-demo'} = req.body
    if (!question || typeof question !== 'string') {
      return res.status(400).json({error: 'Question is required'})
    }

    const result = await evaluateStackingQuery(question, studentId)
    res.json(result)
  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
})

// 4. Record student resolution in Sanity (Section 4 Differentiator)
app.post('/api/resolve', async (req, res) => {
  try {
    const {studentId, retainedSchemeId, surrenderedSchemeId, notes} = req.body
    if (!studentId || !retainedSchemeId || !surrenderedSchemeId) {
      return res.status(400).json({
        error: 'studentId, retainedSchemeId, and surrenderedSchemeId are required',
      })
    }

    const record = await recordStudentDecision({
      studentId,
      retainedSchemeId,
      surrenderedSchemeId,
      decisionNotes: notes,
    })

    res.json({
      success: true,
      decision: record,
      message: 'Resolution recorded in Sanity Content Lake. Agent state updated.',
    })
  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
})

// 5. Get student resolution history
app.get('/api/student/:id/history', async (req, res) => {
  try {
    const studentId = req.params.id
    const history = await getStudentDecisions(studentId)
    res.json({studentId, history})
  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
})

// Fallback to index.html for SPA navigation
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`\n[scholarstack] Agent & Web App online at http://localhost:${PORT}`)
  console.log(`[scholarstack] Sanity Studio: https://scholarstack-rules.sanity.studio`)
  console.log(`[scholarstack] Sanity Context MCP: ${process.env.SANITY_MCP_URL}\n`)
})
