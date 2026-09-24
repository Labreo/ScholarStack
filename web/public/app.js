// ScholarStack Client Application Logic
// Modern Terminal & Compliance Workspace (Anti-Slop Design)

let allSchemes = []
let currentEvaluation = null

// Real-world sample compliance scenarios
const SAMPLES = {
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
  // Preset query pills
  document.querySelectorAll('.preset-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sampleKey = btn.dataset.sample
      const sample = SAMPLES[sampleKey]
      if (sample) {
        document.getElementById('question-input').value = sample.question
        if (sample.studentId) {
          document.getElementById('student-id-input').value = sample.studentId
          loadStudentHistory()
        }
        submitQuery()
      }
    })
  })

  // Quick student identifier buttons
  document.querySelectorAll('.quick-id-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      if (id) {
        document.getElementById('student-id-input').value = id
        loadStudentHistory()
      }
    })
  })

  // Scheme search filter
  const searchInput = document.getElementById('scheme-search-input')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterSchemes(e.target.value)
    })
  }

  // Student ID input change
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

  // Esc key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  })
}

// 1. Check Live Context MCP Status
async function checkStatus() {
  const pill = document.getElementById('mcp-status-pill')
  const text = document.getElementById('mcp-status-text')

  try {
    const res = await fetch('/api/status')
    const data = await res.json()

    if (data.sanity?.contextMcp?.connected) {
      text.textContent = `MCP Online (${data.sanity.contextMcp.tools.length} tools)`
      pill.style.borderColor = 'var(--status-green-border)'
    } else {
      text.textContent = 'Lake: Connected'
      pill.style.borderColor = 'var(--status-yellow-border)'
    }
  } catch (err) {
    text.textContent = 'MCP Offline'
    pill.style.borderColor = 'var(--status-red-border)'
  }
}

// 2. Load and Filter Verified Schemes from Sanity
async function loadSchemes() {
  try {
    const res = await fetch('/api/schemes')
    const data = await res.json()
    allSchemes = data.schemes || []
    renderSchemes(allSchemes)
  } catch (err) {
    document.getElementById('schemes-list').innerHTML = `<div class="empty-notice">Failed to load schemes: ${escapeHtml(err.message)}</div>`
  }
}

function filterSchemes(query) {
  const q = query.toLowerCase().trim()
  if (!q) {
    renderSchemes(allSchemes)
    return
  }
  const filtered = allSchemes.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      (s.category && s.category.toLowerCase().includes(q)) ||
      (s.stackingRule?.exactClauseText && s.stackingRule.exactClauseText.toLowerCase().includes(q))
  )
  renderSchemes(filtered)
}

function renderSchemes(schemes) {
  const container = document.getElementById('schemes-list')
  const countBadge = document.getElementById('scheme-count')

  if (countBadge) {
    countBadge.textContent = `${schemes.length} Scheme${schemes.length === 1 ? '' : 's'}`
  }

  if (schemes.length === 0) {
    container.innerHTML = `<div class="empty-notice">No matching rulebooks found.</div>`
    return
  }

  container.innerHTML = schemes
    .map((s) => {
      const catClass = s.category ? s.category.toLowerCase().replace(/[^a-z]/g, '') : 'general'
      return `
        <div class="scheme-row" onclick="insertSchemeToQuery('${escapeHtml(s.title)}')">
          <div class="scheme-row-top">
            <span class="scheme-row-title">${escapeHtml(s.title)}</span>
            <span class="scheme-row-badge ${catClass}">${escapeHtml(s.category || 'Rulebook')}</span>
          </div>
          <div class="scheme-row-quote">
            "${escapeHtml(s.stackingRule?.exactClauseText || 'No restriction specified')}"
          </div>
        </div>
      `
    })
    .join('')
}

// 3. Load Student Decision History (Sanity Audit Trail)
async function loadStudentHistory() {
  const studentId = document.getElementById('student-id-input').value.trim()
  const list = document.getElementById('decisions-list')
  const countBadge = document.getElementById('session-decisions-count')

  if (!studentId) return

  try {
    const res = await fetch(`/api/student/${encodeURIComponent(studentId)}/history`)
    const data = await res.json()
    const history = data.history || []

    countBadge.textContent = `${history.length} Recorded`

    if (history.length === 0) {
      list.innerHTML = `<div class="empty-notice">No prior resolutions recorded for ${escapeHtml(studentId)}. Relinquishments committed in Sanity Lake will persist here.</div>`
      return
    }

    list.innerHTML = history
      .map(
        (h) => `
      <div class="decision-log-entry">
        <div class="log-meta-line">
          <span>${new Date(h.resolvedAt).toISOString().split('T')[0]}</span>
          <span class="log-status-tag">${escapeHtml(h.resolutionStatus || 'COMMITTED')}</span>
        </div>
        <div class="log-row">
          <span class="log-lbl">RETAINED:</span>
          <span class="log-val"><strong>${escapeHtml(h.retainedScheme?.title || 'Unknown')}</strong></span>
        </div>
        <div class="log-row">
          <span class="log-lbl">SURRENDERED:</span>
          <span class="log-val">${escapeHtml(h.surrenderedScheme?.title || 'Unknown')}</span>
        </div>
        ${
          h.notes
            ? `<div class="log-row">
                <span class="log-lbl">REF_MEMO:</span>
                <span class="log-val" style="color: var(--text-muted); font-size: 0.72rem;">${escapeHtml(h.notes)}</span>
              </div>`
            : ''
        }
      </div>
    `
      )
      .join('')
  } catch (err) {
    list.innerHTML = `<div class="empty-notice">Error reading audit history: ${escapeHtml(err.message)}</div>`
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
      <div class="verdict-box prohibited">
        <div class="verdict-header-row">
          <span class="verdict-banner-tag">EVALUATION FAILED</span>
        </div>
        <div class="verdict-summary-text">${escapeHtml(err.message)}</div>
      </div>
    `
  } finally {
    loading.classList.add('hidden')
    submitBtn.disabled = false
  }
}

// 5. Render Verdict & Citations (Zero Emojis, Pure Monospace Hierarchy)
function renderResult(data) {
  const container = document.getElementById('result-container')

  let boxClass = 'prohibited'
  let bannerTag = '<span class="verdict-banner-tag">NON-STACKING CONFLICT DETECTED</span>'

  if (data.verdict === 'ALLOWED') {
    boxClass = 'allowed'
    bannerTag = '<span class="verdict-banner-tag">CONCURRENT AWARDS PERMITTED</span>'
  } else if (data.verdict === 'CONDITIONAL') {
    boxClass = 'conditional'
    bannerTag = '<span class="verdict-banner-tag">CONDITIONAL APPROVAL REQUIRED</span>'
  } else if (data.verdict === 'OUT_OF_SCOPE') {
    boxClass = 'conditional'
    bannerTag = '<span class="verdict-banner-tag">SCHEME NOT IN VERIFIED CORPUS</span>'
  }

  // Format conflicting clauses from Sanity Content Lake
  let clausesHtml = ''
  if (data.conflictingClauses && data.conflictingClauses.length > 0) {
    clausesHtml = `
      <div class="clauses-section">
        <div class="clauses-title">
          VERBATIM NON-STACKING CLAUSES (SANITY CONTENT LAKE):
        </div>
        ${data.conflictingClauses
          .map(
            (c) => `
          <div class="clause-item">
            <div class="clause-meta">
              <span class="clause-scheme-title">${escapeHtml(c.schemeTitle)}</span>
              <span class="clause-rule-cite">${escapeHtml(c.clauseRef || 'Official Rulebook')}</span>
            </div>
            <div class="clause-quote-text">
              &gt; "${escapeHtml(c.exactQuote)}"
            </div>
            <div class="clause-footer-row">
              <span class="clause-penalty-tag">PENALTY: ${escapeHtml(c.consequence || 'Disqualification & Clawback')}</span>
              ${
                c.officialDocumentUrl
                  ? `<a href="${c.officialDocumentUrl}" target="_blank" rel="noopener noreferrer" class="pdf-link-btn">
                      Inspect Official PDF &rarr;
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

  // Resolution action prompt
  let resolveHtml = ''
  if (data.canResolve) {
    resolveHtml = `
      <div class="resolution-box">
        <div class="resolution-info">
          <span class="resolution-title">Administrative Action: Resolve Conflict</span>
          <span class="resolution-desc">
            To prevent recovery proceedings and disqualification, record the student's formal relinquishment of one award into Sanity Content Lake.
          </span>
        </div>
        <button class="btn-open-resolution" onclick="openResolutionModal()">
          Record Formal Relinquishment &rarr;
        </button>
      </div>
    `
  }

  // Procedure callout
  let procedureHtml = ''
  if (data.nextSteps) {
    procedureHtml = `
      <div class="procedure-callout">
        <div class="procedure-title">ADMINISTRATIVE PROCEDURE:</div>
        <div>${escapeHtml(data.nextSteps)}</div>
      </div>
    `
  }

  container.innerHTML = `
    <div class="verdict-box ${boxClass}">
      <div class="verdict-header-row">
        ${bannerTag}
        <span class="confidence-indicator">confidence: verified</span>
      </div>
      <div class="verdict-summary-text">${escapeHtml(data.summary)}</div>
      ${procedureHtml}
      ${clausesHtml}
      ${resolveHtml}
    </div>
  `

  container.scrollTop = 0
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
    alert('Please select different schemes for retention and surrender.')
    return
  }

  confirmBtn.disabled = true
  confirmBtn.textContent = 'Committing to Sanity...'

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

    alert('Decision successfully committed to Sanity Content Lake. The compliance engine will carry this decision across subsequent inquiries.')
  } catch (err) {
    alert('Error recording decision in Sanity: ' + err.message)
  } finally {
    confirmBtn.disabled = false
    confirmBtn.textContent = 'Commit Decision to Sanity Lake'
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

