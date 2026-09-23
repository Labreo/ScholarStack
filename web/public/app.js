// ScholarStack Client Application Logic

let allSchemes = []
let currentEvaluation = null

// Preset Scenarios
const PRESETS = {
  'direct-trap': {
    question: 'I am getting the Goa Home Nursing Scholarship. Can I also accept the Samsung Star Scholar Program?',
    studentId: 'student-akash-sharma',
  },
  'inverted-query': {
    question: 'If I already won the Samsung Star Scholar, am I allowed to apply for and receive the Central Post-Matric SC/ST scholarship?',
    studentId: 'student-priya-patel',
  },
  'resolution-demo': {
    question: 'I surrendered the Goa scholarship. Can I now accept the FTII scholarship alongside Samsung Star Scholar?',
    studentId: 'student-akash-sharma',
  },
  'out-of-scope': {
    question: 'Can I stack the Eiffel Excellence Scholarship in France with the Rhodes Scholarship at Oxford?',
    studentId: 'student-demo',
  },
}

document.addEventListener('DOMContentLoaded', () => {
  initApp()
  setupEventListeners()
})

async function initApp() {
  await Promise.all([
    checkStatus(),
    loadSchemes(),
    loadStudentHistory(),
  ])
}

function setupEventListeners() {
  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset
      const preset = PRESETS[presetKey]
      if (preset) {
        document.getElementById('question-input').value = preset.question
        if (preset.studentId) {
          document.getElementById('student-id-input').value = preset.studentId
          loadStudentHistory()
        }
        submitQuery()
      }
    })
  })

  // Student ID change
  document.getElementById('student-id-input').addEventListener('change', () => {
    loadStudentHistory()
  })

  // Query form submission
  document.getElementById('query-form').addEventListener('submit', (e) => {
    e.preventDefault()
    submitQuery()
  })

  // Submit on Cmd/Ctrl+Enter or Enter without Shift
  document.getElementById('question-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitQuery()
    }
  })

  // Modal close handlers
  document.getElementById('close-modal-btn').addEventListener('click', closeModal)
  document.getElementById('cancel-modal-btn').addEventListener('click', closeModal)
  document.getElementById('confirm-resolution-btn').addEventListener('click', confirmResolution)
}

// 1. Check Live Context MCP Status
async function checkStatus() {
  const pill = document.getElementById('mcp-status-pill')
  const text = document.getElementById('mcp-status-text')

  try {
    const res = await fetch('/api/status')
    const data = await res.json()

    if (data.sanity?.contextMcp?.connected) {
      pill.style.background = 'rgba(16, 185, 129, 0.15)'
      pill.style.borderColor = 'rgba(16, 185, 129, 0.4)'
      pill.style.color = '#6ee7b7'
      text.innerHTML = `Context MCP: <strong>Live & Connected</strong> (${data.sanity.contextMcp.tools.length} Tools)`
    } else {
      pill.style.background = 'rgba(245, 158, 11, 0.15)'
      pill.style.borderColor = 'rgba(245, 158, 11, 0.4)'
      pill.style.color = '#fcd34d'
      text.textContent = 'Sanity Lake: Connected (Studio Schema Loaded)'
    }
  } catch (err) {
    pill.style.color = '#f87171'
    text.textContent = 'MCP Endpoint: Offline'
  }
}

// 2. Load Verified Schemes from Sanity
async function loadSchemes() {
  const container = document.getElementById('schemes-list')
  const countBadge = document.getElementById('scheme-count')

  try {
    const res = await fetch('/api/schemes')
    const data = await res.json()
    allSchemes = data.schemes || []

    countBadge.textContent = `${allSchemes.length} Schemes`
    container.innerHTML = allSchemes
      .map(
        (s) => `
      <div class="scheme-card-item" onclick="insertSchemeToQuery('${escapeHtml(s.title)}')">
        <div class="scheme-item-top">
          <span class="scheme-item-title">${escapeHtml(s.title)}</span>
          <span class="category-tag ${s.category}">${s.category}</span>
        </div>
        <div class="scheme-item-quote">
          "${escapeHtml(s.stackingRule?.exactClauseText || 'No restriction specified')}"
        </div>
      </div>
    `
      )
      .join('')
  } catch (err) {
    container.innerHTML = `<div class="empty-state">Failed to load schemes: ${err.message}</div>`
  }
}

// 3. Load Student Decision History (Section 4 Differentiator)
async function loadStudentHistory() {
  const studentId = document.getElementById('student-id-input').value.trim()
  const list = document.getElementById('decisions-list')
  const countBadge = document.getElementById('session-decisions-count')

  if (!studentId) return

  try {
    const res = await fetch(`/api/student/${encodeURIComponent(studentId)}/history`)
    const data = await res.json()
    const history = data.history || []

    countBadge.textContent = `${history.length} Recorded Decision${history.length === 1 ? '' : 's'} in Sanity`

    if (history.length === 0) {
      list.innerHTML = `<div class="empty-state">No prior decisions recorded for <strong>${escapeHtml(studentId)}</strong>. Conflicts resolved will persist here.</div>`
      return
    }

    list.innerHTML = history
      .map(
        (h) => `
      <div class="decision-item">
        <div class="decision-header">
          <span>${new Date(h.resolvedAt).toLocaleDateString()}</span>
          <span class="tag-accent">${h.resolutionStatus}</span>
        </div>
        <div class="decision-content">
          <div>Kept: <strong>${escapeHtml(h.retainedScheme?.title || 'Unknown')}</strong></div>
          <div>Surrendered: <span>${escapeHtml(h.surrenderedScheme?.title || 'Unknown')}</span></div>
        </div>
      </div>
    `
      )
      .join('')
  } catch (err) {
    list.innerHTML = `<div class="empty-state">Error fetching history: ${err.message}</div>`
  }
}

// 4. Submit Query
async function submitQuery() {
  const questionInput = document.getElementById('question-input')
  const question = questionInput.value.trim()
  const studentId = document.getElementById('student-id-input').value.trim() || 'student-demo'
  const loading = document.getElementById('loading-spinner')
  const resultContainer = document.getElementById('result-container')
  const submitBtn = document.getElementById('submit-btn')

  if (!question) return

  loading.classList.remove('hidden')
  resultContainer.classList.add('hidden')
  submitBtn.disabled = true

  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({question, studentId}),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to evaluate stacking rules')
    }

    const data = await res.json()
    currentEvaluation = data
    renderResult(data)
  } catch (err) {
    resultContainer.innerHTML = `
      <div class="verdict-card prohibited">
        <div class="verdict-badge">Error</div>
        <div class="verdict-summary">${escapeHtml(err.message)}</div>
      </div>
    `
    resultContainer.classList.remove('hidden')
  } finally {
    loading.classList.add('hidden')
    submitBtn.disabled = false
  }
}

// 5. Render Verdict & Citations
function renderResult(data) {
  const container = document.getElementById('result-container')

  let cardClass = 'prohibited'
  let badgeText = '⛔ Stacking Trap Detected'

  if (data.verdict === 'ALLOWED') {
    cardClass = 'allowed'
    badgeText = '✅ Stacking Permitted'
  } else if (data.verdict === 'CONDITIONAL') {
    cardClass = 'conditional'
    badgeText = '⚠️ Conditional (Prior Permission Required)'
  } else if (data.verdict === 'OUT_OF_SCOPE') {
    cardClass = 'conditional'
    badgeText = '🔍 Out of Verified Scope'
  }

  // Format conflicting clauses
  let clausesHtml = ''
  if (data.conflictingClauses && data.conflictingClauses.length > 0) {
    clausesHtml = `
      <div class="clauses-container">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em;">
          Verbatim Non-Stacking Clauses (Sanity Content Lake):
        </h4>
        ${data.conflictingClauses
          .map(
            (c) => `
          <div class="clause-card">
            <div class="clause-header">
              <span class="scheme-name">${escapeHtml(c.schemeTitle)}</span>
              <span class="clause-ref-tag">${escapeHtml(c.clauseRef || 'Official Rulebook')}</span>
            </div>
            <div class="clause-quote-box">
              "${escapeHtml(c.exactQuote)}"
            </div>
            <div class="clause-footer">
              <span class="clause-consequence">Penalty: ${escapeHtml(c.consequence || 'Disqualification & Clawback')}</span>
              ${
                c.officialDocumentUrl
                  ? `<a href="${c.officialDocumentUrl}" target="_blank" rel="noopener noreferrer" class="official-pdf-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      Inspect Official Rulebook PDF
                    </a>`
                  : ''
              }
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `
  }

  // Resolution button
  let resolveHtml = ''
  if (data.canResolve) {
    resolveHtml = `
      <div class="resolution-prompt-card">
        <div>
          <strong>Persistent State Differentiator:</strong>
          <p>Log the student's formal surrender choice into Sanity so subsequent questions reason from this updated state.</p>
        </div>
        <button class="resolve-btn" onclick="openResolutionModal()">Resolve Conflict in Sanity</button>
      </div>
    `
  }

  container.innerHTML = `
    <div class="verdict-card ${cardClass}">
      <div class="verdict-badge">${badgeText}</div>
      <div class="verdict-summary">${escapeHtml(data.summary)}</div>
      
      ${
        data.nextSteps
          ? `<div style="font-size: 0.88rem; color: #94a3b8; margin-top: 6px;">
              <strong>Official Procedure:</strong> ${escapeHtml(data.nextSteps)}
            </div>`
          : ''
      }

      ${clausesHtml}
      ${resolveHtml}
    </div>
  `

  container.classList.remove('hidden')
  container.scrollIntoView({behavior: 'smooth', block: 'nearest'})
}

// 6. Resolution Modal Handlers
function openResolutionModal() {
  const modal = document.getElementById('resolution-modal')
  const retainSelect = document.getElementById('retain-scheme-select')
  const surrenderSelect = document.getElementById('surrender-scheme-select')

  // Populate options with verified schemes
  const optionsHtml = allSchemes
    .map((s) => `<option value="${s._id}">${escapeHtml(s.title)}</option>`)
    .join('')

  retainSelect.innerHTML = optionsHtml
  surrenderSelect.innerHTML = optionsHtml

  // Auto-select conflicting schemes if present
  if (currentEvaluation?.identifiedSchemes?.schemeA && currentEvaluation?.identifiedSchemes?.schemeB) {
    const sA = allSchemes.find((s) => s.title.includes(currentEvaluation.identifiedSchemes.schemeA.title))
    const sB = allSchemes.find((s) => s.title.includes(currentEvaluation.identifiedSchemes.schemeB.title))

    if (sA && sB) {
      retainSelect.value = sB._id // Keep Scheme B
      surrenderSelect.value = sA._id // Surrender Scheme A
    }
  }

  modal.classList.remove('hidden')
}

function closeModal() {
  document.getElementById('resolution-modal').classList.add('hidden')
}

async function confirmResolution() {
  const studentId = document.getElementById('student-id-input').value.trim()
  const retainId = document.getElementById('retain-scheme-select').value
  const surrenderId = document.getElementById('surrender-scheme-select').value
  const notes = document.getElementById('resolution-notes').value.trim()
  const confirmBtn = document.getElementById('confirm-resolution-btn')

  if (retainId === surrenderId) {
    alert('Please choose different schemes to retain and surrender.')
    return
  }

  confirmBtn.disabled = true
  confirmBtn.textContent = 'Writing to Sanity...'

  try {
    const res = await fetch('/api/resolve', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        studentId,
        retainedSchemeId: retainId,
        surrenderedSchemeId: surrenderId,
        notes,
      }),
    })

    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.error || 'Failed to record resolution')
    }

    closeModal()
    await loadStudentHistory()

    alert('Resolution successfully committed to Sanity Content Lake! The agent will now carry this decision forward.')
  } catch (err) {
    alert('Error recording decision: ' + err.message)
  } finally {
    confirmBtn.disabled = false
    confirmBtn.textContent = 'Write Decision to Sanity'
  }
}

function insertSchemeToQuery(title) {
  const input = document.getElementById('question-input')
  if (input.value) {
    input.value += ` and ${title}`
  } else {
    input.value = `Can I receive ${title}?`
  }
  input.focus()
}

function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
