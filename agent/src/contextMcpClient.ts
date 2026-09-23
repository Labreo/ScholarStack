import * as dotenv from 'dotenv'
import * as path from 'path'
import {sanityClient, ScholarshipScheme} from './sanityClient'

dotenv.config({path: path.resolve(process.cwd(), '.env')})

const projectId = process.env.SANITY_PROJECT_ID || 'axvnim0k'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_PROJECT_TOKEN || process.env.SANITY_ORG_TOKEN

const MCP_ENDPOINT = `https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}`

export interface ContextMCPTool {
  name: string
  description: string
  inputSchema: any
}

/**
 * Interface for Sanity Context MCP endpoint
 */
export class SanityContextMCPClient {
  private endpoint: string
  private token: string

  constructor(endpoint = MCP_ENDPOINT, authToken = token) {
    this.endpoint = endpoint
    this.token = authToken || ''
  }

  /**
   * Ping / List tools from the live Context MCP server
   */
  async listTools(): Promise<{connected: boolean; tools: ContextMCPTool[]; message?: string}> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/list',
          id: 1,
        }),
      })

      const data = await response.json()
      if (data.result && data.result.tools) {
        return {
          connected: true,
          tools: data.result.tools,
        }
      }

      if (data.error) {
        return {
          connected: false,
          tools: [],
          message: data.error.message,
        }
      }

      return {connected: false, tools: []}
    } catch (err: any) {
      return {
        connected: false,
        tools: [],
        message: err.message,
      }
    }
  }

  /**
   * Fetch compressed schema overview from Sanity Context MCP /initial-context endpoint
   */
  async fetchInitialContext(): Promise<string> {
    try {
      const response = await fetch(`${this.endpoint}/initial-context`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'text/plain, application/json',
        },
      })
      if (response.ok) {
        return await response.text()
      }
      return ''
    } catch (err: any) {
      console.warn('Failed to fetch initial-context from Context MCP:', err.message)
      return ''
    }
  }

  /**
   * Execute GROQ query with semantic context
   */
  async querySchemes(): Promise<ScholarshipScheme[]> {
    return await sanityClient.fetch<ScholarshipScheme[]>(
      `*[_type == "scholarshipScheme"] | order(title asc)`
    )
  }
}

export const contextMcpClient = new SanityContextMCPClient()
