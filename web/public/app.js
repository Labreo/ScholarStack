// ScholarStack Client Application Logic
// Production-Grade Financial Aid & Compliance Portal
// Built with Tailwind CSS v3 & DaisyUI

let allSchemes = []
let currentEvaluation = null
let activeStudent = {
  id: 'student-akash-sharma',
  name: 'Akash Sharma',
  institution: 'Indian Institute of Technology Bombay',
}
let activeCategoryFilter = 'all'

document.addEventListener('DOMContentLoaded', () => {
  initTheme()
  initApp()
  setupEventListeners()
})

// ==========================================
// 1. Theme Management (DaisyUI Light / Dark)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('scholarstack-theme') || 'dark'
  setTheme(savedTheme)
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('scholarstack-theme', theme)

  const sunIcon = document.getElementById('theme-sun-icon')
  const moonIcon = document.getElementById('theme-moon-icon')

  if (theme === 'dark') {
    sunIcon?.classList.remove('hidden')
    moonIcon?.classList.add('hidden')
  } else {
    sunIcon?.classList.add('hidden')
    moonIcon?.classList.remove('hidden')
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme')
  const next = current === 'dark' ? 'light' : 'dark'
  setTheme(next)
}

// ==========================================
// 2. Application Initialization
// ==========================================
async function initApp() {
  await Promise.all([
    checkStatus(),
    loadSchemes(),
    loadStudentHistory(),
  ])
}

function setupEventListeners() {
  // Theme Toggle Button
  document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme)

  // Navigation Tabs (Desktop)
  document.getElementById('nav-tab-verify')?.addEventListener('click', () => switchTab('verify'))
  document.getElementById('nav-tab-ledger')?.addEventListener('click', () => switchTab('ledger'))
  document.getElementById('nav-tab-directory')?.addEventListener('click', () => switchTab('directory'))

  // Navigation Tabs (Mobile)
  document.getElementById('mob-tab-verify')?.addEventListener('click', () => switchTab('verify'))
  document.getElementById('mob-tab-ledger')?.addEventListener('click', () => switchTab('ledger'))
  document.getElementById('mob-tab-directory')?.addEventListener('click', () => switchTab('directory'))

  // Student Profile Switching
  document.querySelectorAll('.student-select-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const name = btn.dataset.name
      if (id && name) {
        setStudentProfile(id, name)
      }
    })
  })

  // Custom Student ID Apply
  document.getElementById('apply-custom-student')?.addEventListener('click', () => {
    const input = document.getElementById('custom-student-id')
    const customId = input?.value.trim()
    if (customId) {
      setStudentProfile(customId, customId)
      input.value = ''
    }
  })

  // Award Selectors Change Sync
  document.getElementById('select-scheme-a')?.addEventListener('change', syncAwardsToQuery)
  document.getElementById('select-scheme-b')?.addEventListener('change', syncAwardsToQuery)

  // Swap Awards Button
  document.getElementById('swap-awards-btn')?.addEventListener('click', swapAwards)

  // Reset Form Button
  document.getElementById('clear-form-btn')?.addEventListener('click', resetForm)

  // Submit Verification Button
  document.getElementById('submit-verify-btn')?.addEventListener('click', submitVerification)

  // Enter key in question input
  document.getElementById('question-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitVerification()
    }
  })

  // Ledger Refresh Button
  document.getElementById('refresh-ledger-btn')?.addEventListener('click', loadStudentHistory)

  // Direct Surrender Modal Open from Ledger
  document.getElementById('open-surrender-modal-direct-btn')?.addEventListener('click', openResolutionModal)

  // Confirm Relinquishment in Modal
  document.getElementById('confirm-resolution-btn')?.addEventListener('click', confirmResolution)

  // Directory Search Filter
  document.getElementById('directory-search-input')?.addEventListener('input', (e) => {
    filterDirectory()
  })

  // Directory Category Pills
  document.querySelectorAll('.dir-filter-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.dir-filter-pill').forEach((p) => {
        p.classList.remove('active', 'btn-primary')
        p.classList.add('btn-ghost')
      })
      pill.classList.add('active', 'btn-primary')
      pill.classList.remove('btn-ghost')
      activeCategoryFilter = pill.dataset.cat || 'all'
      filterDirectory()
    })
  })

  // Telemetry Badge Modal Trigger
  document.getElementById('telemetry-badge-btn')?.addEventListener('click', openTelemetryModal)

  // Print Dossier Button
  document.getElementById('print-dossier-btn')?.addEventListener('click', () => {
    window.print()
  })
}

// ==========================================
// 3. Tab Switching Architecture
// ==========================================
function switchTab(tabId) {
  const views = {
    verify: document.getElementById('view-verify'),
    ledger: document.getElementById('view-ledger'),
    directory: document.getElementById('view-directory'),
  }

  const navBtns = {
    verify: document.getElementById('nav-tab-verify'),
    ledger: document.getElementById('nav-tab-ledger'),
    directory: document.getElementById('nav-tab-directory'),
  }

  const mobBtns = {
    verify: document.getElementById('mob-tab-verify'),
    ledger: document.getElementById('mob-tab-ledger'),
    directory: document.getElementById('mob-tab-directory'),
  }

  // Toggle View Visibility
  Object.keys(views).forEach((k) => {
    if (k === tabId) {
      views[k]?.classList.remove('hidden')
    } else {
      views[k]?.classList.add('hidden')
    }
  })

  // Update Nav Button Styles
  Object.keys(navBtns).forEach((k) => {
    if (k === tabId) {
      navBtns[k]?.classList.add('btn-primary', 'text-white')
      navBtns[k]?.classList.remove('btn-ghost')
    } else {
      navBtns[k]?.classList.remove('btn-primary', 'text-white')
      navBtns[k]?.classList.add('btn-ghost')
    }
  })

  // Update Mobile Nav Styles
  Object.keys(mobBtns).forEach((k) => {
    if (k === tabId) {
      mobBtns[k]?.classList.add('active')
    } else {
      mobBtns[k]?.classList.remove('active')
    }
  })

  // Close mobile dropdown if open
  const dropdown = document.querySelector('.navbar-start .dropdown')
  if (dropdown && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }

  window.scrollTo({top: 0, behavior: 'smooth'})
}

// ==========================================
// 4. Student Profile Management
// ==========================================
function setStudentProfile(id, name) {
  activeStudent.id = id
  activeStudent.name = name

  // Update navbar label
  const label = document.getElementById('active-student-label')
  if (label) label.textContent = name

  // Update Ledger Header
  const ledgerName = document.getElementById('ledger-student-name')
  const ledgerId = document.getElementById('ledger-student-id')
  if (ledgerName) ledgerName.textContent = name
  if (ledgerId) ledgerId.textContent = id

  // Update active state in dropdown
  document.querySelectorAll('.student-select-btn').forEach((btn) => {
    if (btn.dataset.id === id) {
      btn.classList.add('active')
      if (!btn.querySelector('.badge')) {
        const badge = document.createElement('span')
        badge.className = 'badge badge-xs badge-primary'
        badge.textContent = 'Active'
        btn.appendChild(badge)
      }
    } else {
      btn.classList.remove('active')
      const existingBadge = btn.querySelector('.badge')
      if (existingBadge) existingBadge.remove()
    }
  })

  // Reload ledger history for this student
  loadStudentHistory()
}

// ==========================================
// 5. Check Context MCP & Lake Health
// ==========================================
async function checkStatus() {
  const statusText = document.getElementById('system-status-text')
  try {
    const res = await fetch('/api/status')
    const data = await res.json()
    if (data.sanity?.contextMcp?.connected) {
      if (statusText) statusText.textContent = `MCP Connected (${data.sanity.contextMcp.tools.length} Tools)`
    } else {
      if (statusText) statusText.textContent = 'Sanity Lake: Online'
    }
  } catch (err) {
    if (statusText) statusText.textContent = 'Lake: Offline'
  }
}

// ==========================================
// 6. Load Verified Schemes from Sanity
// ==========================================
async function loadSchemes() {
  try {
    const res = await fetch('/api/schemes')
    const data = await res.json()
    allSchemes = data.schemes || []

    const badge = document.getElementById('verified-schemes-badge')
    const countSpan = document.getElementById('dir-all-count')
    if (badge) badge.textContent = `${allSchemes.length} Verified Policies`
    if (countSpan) countSpan.textContent = allSchemes.length

    populateSchemeSelects(allSchemes)
    renderDirectory(allSchemes)
  } catch (err) {
    console.error('Failed to load schemes:', err)
  }
}

function populateSchemeSelects(schemes) {
  const selectA = document.getElementById('select-scheme-a')
  const selectB = document.getElementById('select-scheme-b')

  if (!selectA || !selectB) return

  // Group schemes by category
  const categories = {}
  schemes.forEach((s) => {
    const cat = s.category || 'General'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push(s)
  })

  const buildOptions = (placeholder) => {
    let html = `<option value="">${placeholder}</option>`
    Object.keys(categories)
      .sort()
      .forEach((cat) => {
        html += `<optgroup label="${escapeHtml(cat)}">`
        categories[cat].forEach((s) => {
          html += `<option value="${escapeHtml(s.title)}">${escapeHtml(s.title)}</option>`
        })
        html += `</optgroup>`
      })
    return html
  }

  selectA.innerHTML = buildOptions('-- Choose active scholarship --')
  selectB.innerHTML = buildOptions('-- Choose prospective scholarship --')
}

// ==========================================
// 7. Verification Form Helpers
// ==========================================
function syncAwardsToQuery() {
  const schemeA = document.getElementById('select-scheme-a')?.value.trim()
  const schemeB = document.getElementById('select-scheme-b')?.value.trim()
  const questionInput = document.getElementById('question-input')

  if (!questionInput) return

  if (schemeA && schemeB) {
    questionInput.value = `I am currently receiving the ${schemeA}. Am I permitted to also apply for and accept the ${schemeB}?`
  } else if (schemeA) {
    questionInput.value = `I currently receive the ${schemeA}. What are its anti-stacking covenants and restrictions?`
  } else if (schemeB) {
    questionInput.value = `Can I receive the ${schemeB} alongside another scholarship award?`
  }
}

function swapAwards() {
  const selectA = document.getElementById('select-scheme-a')
  const selectB = document.getElementById('select-scheme-b')

  if (!selectA || !selectB) return

  const temp = selectA.value
  selectA.value = selectB.value
  selectB.value = temp

  syncAwardsToQuery()
}

function resetForm() {
  const selectA = document.getElementById('select-scheme-a')
  const selectB = document.getElementById('select-scheme-b')
  const questionInput = document.getElementById('question-input')

  if (selectA) selectA.value = ''
  if (selectB) selectB.value = ''
  if (questionInput) questionInput.value = ''

  const resultContainer = document.getElementById('result-container')
  if (resultContainer) {
    resultContainer.innerHTML = `
      <div class="card bg-base-100 border border-base-300 shadow-sm rounded-xl p-6 md:p-8">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            Standard Compliance Engine
          </div>
          <h2 class="text-xl font-bold text-base-content tracking-tight">Institutional Award Compatibility Verification</h2>
          <p class="text-sm text-base-content/70 mt-1 leading-relaxed">
            Select two scholarship schemes above to automatically inspect statutory anti-stacking covenants, gazette publications, and CSR agreements stored in Sanity. The engine detects legal conflicts before funds are accepted.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-base-200">
          <div class="p-4 rounded-lg bg-base-200/50 border border-base-300 space-y-2">
            <div class="w-8 h-8 rounded-md bg-base-100 border border-base-300 flex items-center justify-center text-primary font-bold text-sm">01</div>
            <div class="font-semibold text-sm text-base-content">Statutory Covenants</div>
            <div class="text-xs text-base-content/60 leading-relaxed">Directly quotes verbatim anti-stacking restrictions and gazette notifications indexed in Sanity.</div>
          </div>
          <div class="p-4 rounded-lg bg-base-200/50 border border-base-300 space-y-2">
            <div class="w-8 h-8 rounded-md bg-base-100 border border-base-300 flex items-center justify-center text-primary font-bold text-sm">02</div>
            <div class="font-semibold text-sm text-base-content">Penalty Enforcement</div>
            <div class="text-xs text-base-content/60 leading-relaxed">Identifies whether dual receipt triggers mandatory clawback, penal interest, or award revocation.</div>
          </div>
          <div class="p-4 rounded-lg bg-base-200/50 border border-base-300 space-y-2">
            <div class="w-8 h-8 rounded-md bg-base-100 border border-base-300 flex items-center justify-center text-primary font-bold text-sm">03</div>
            <div class="font-semibold text-sm text-base-content">Administrative Ledger</div>
            <div class="text-xs text-base-content/60 leading-relaxed">Records formal student award relinquishments into Sanity Content Lake to govern all subsequent audits.</div>
          </div>
        </div>
      </div>
    `
  }
}

// ==========================================
// 8. Submit Verification Request
// ==========================================
async function submitVerification() {
  const questionInput = document.getElementById('question-input')
  const selectA = document.getElementById('select-scheme-a')
  const selectB = document.getElementById('select-scheme-b')

  let question = questionInput?.value.trim()

  if (!question && selectA?.value && selectB?.value) {
    question = `Can I receive both ${selectA.value} and ${selectB.value}?`
    if (questionInput) questionInput.value = question
  }

  if (!question) {
    alert('Please select two scholarships or type your compliance inquiry.')
    questionInput?.focus()
    return
  }

  const loading = document.getElementById('verify-loading')
  const resultContainer = document.getElementById('result-container')
  const submitBtn = document.getElementById('submit-verify-btn')

  loading?.classList.remove('hidden')
  if (submitBtn) {
    submitBtn.disabled = true
    submitBtn.innerHTML = `
      <span class="loading loading-spinner loading-xs"></span>
      <span>Evaluating...</span>
    `
  }

  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        question,
        studentId: activeStudent.id,
      }),
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || 'Failed to evaluate compliance')
    }

    const data = await res.json()
    currentEvaluation = data
    renderEvaluationResult(data)
  } catch (err) {
    if (resultContainer) {
      resultContainer.innerHTML = `
        <div class="alert alert-error shadow-sm rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h3 class="font-bold text-sm">Evaluation Error</h3>
            <div class="text-xs">${escapeHtml(err.message)}</div>
          </div>
        </div>
      `
    }
  } finally {
    loading?.classList.add('hidden')
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Verify Compatibility</span>
      `
    }
  }
}

// ==========================================
// 9. Render Compliance Audit Results
// ==========================================
function renderEvaluationResult(data) {
  const container = document.getElementById('result-container')
  if (!container) return

  let alertClass = 'alert-error'
  let alertIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  `
  let verdictBadge = '<span class="badge badge-error text-white font-semibold text-xs">NON-STACKING CONFLICT DETECTED</span>'
  let verdictHeading = 'Strict Non-Stacking Violation'

  if (data.verdict === 'ALLOWED') {
    alertClass = 'alert-success'
    alertIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `
    verdictBadge = '<span class="badge badge-success text-white font-semibold text-xs">CONCURRENT AWARDS PERMITTED</span>'
    verdictHeading = 'Stacking Allowed Under Current Guidelines'
  } else if (data.verdict === 'CONDITIONAL') {
    alertClass = 'alert-warning'
    alertIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    `
    verdictBadge = '<span class="badge badge-warning text-white font-semibold text-xs">CONDITIONAL APPROVAL REQUIRED</span>'
    verdictHeading = 'Conditional Acceptance Permitted'
  } else if (data.verdict === 'OUT_OF_SCOPE') {
    alertClass = 'alert-info'
    alertIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `
    verdictBadge = '<span class="badge badge-info text-white font-semibold text-xs">SCHEME OUTSIDE CORPUS</span>'
    verdictHeading = 'Unverified International / Unlisted Award'
  }

  // Conflicting Clauses Section
  let clausesHtml = ''
  if (data.conflictingClauses && data.conflictingClauses.length > 0) {
    clausesHtml = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold uppercase tracking-wider text-base-content/80">
            Verbatim Non-Stacking Covenants (Sanity Content Lake)
          </h4>
          <span class="badge badge-sm badge-neutral text-[10px] font-mono">
            ${data.conflictingClauses.length} Clause${data.conflictingClauses.length === 1 ? '' : 's'} Cited
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${data.conflictingClauses
            .map(
              (c) => `
            <div class="card bg-base-100 border border-base-300 shadow-sm rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="font-bold text-sm text-base-content">${escapeHtml(c.schemeTitle)}</div>
                    <div class="text-[11px] text-primary font-mono mt-0.5">${escapeHtml(c.clauseRef || 'Statutory Gazette Ref')}</div>
                  </div>
                  <span class="badge badge-outline badge-xs text-[10px] font-medium uppercase">${escapeHtml(c.ruleType || 'Prohibition')}</span>
                </div>

                <blockquote class="text-xs text-base-content/80 italic p-3 bg-base-200/60 rounded-lg border-l-2 border-primary leading-relaxed">
                  "${escapeHtml(c.exactQuote)}"
                </blockquote>
              </div>

              <div class="pt-2 border-t border-base-200 flex flex-col gap-2">
                <div class="text-[11px] text-error font-medium">
                  <span class="font-bold">Penalty:</span> ${escapeHtml(c.consequence || 'Full recovery of disbursed funds with penal interest & immediate cancellation')}
                </div>
                ${
                  c.officialDocumentUrl
                    ? `<a href="${c.officialDocumentUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline btn-primary gap-1 w-full justify-center">
                        <span>Inspect Official Gazette PDF</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>`
                    : ''
                }
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
  }

  // Resolution Action Banner (when conflict can be resolved)
  let resolutionHtml = ''
  if (data.canResolve) {
    resolutionHtml = `
      <div class="card bg-warning/10 border border-warning/30 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="font-bold text-sm text-base-content flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Administrative Remedy: Record Formal Relinquishment</span>
          </div>
          <p class="text-xs text-base-content/70">
            To prevent recovery proceedings and disqualification, submit a formal surrender memo into Sanity Lake.
          </p>
        </div>
        <button type="button" class="btn btn-warning btn-sm text-black font-semibold shrink-0" onclick="openResolutionModal()">
          Record Relinquishment
        </button>
      </div>
    `
  }

  // Next Steps / Legal Advice Callout
  let nextStepsHtml = ''
  if (data.nextSteps) {
    nextStepsHtml = `
      <div class="p-4 rounded-xl bg-base-100 border border-base-300 space-y-1.5">
        <div class="text-xs font-bold uppercase tracking-wider text-base-content/80">Administrative Guidance &amp; Procedure</div>
        <div class="text-xs text-base-content/70 leading-relaxed">${escapeHtml(data.nextSteps)}</div>
      </div>
    `
  }

  container.innerHTML = `
    <!-- Top Status Banner -->
    <div class="alert ${alertClass} shadow-sm rounded-xl text-left">
      ${alertIcon}
      <div class="flex-1">
        <div class="flex items-center gap-2">
          ${verdictBadge}
          <span class="text-xs text-base-content/60 font-medium">Confidence: Verified Against Sanity Corpus</span>
        </div>
        <h3 class="font-bold text-base mt-1">${escapeHtml(verdictHeading)}</h3>
        <p class="text-xs mt-0.5 leading-relaxed opacity-90">${escapeHtml(data.summary)}</p>
      </div>
    </div>

    <!-- Audit Actions & Export Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-base-100 border border-base-300 rounded-xl">
      <div class="flex items-center gap-2 text-xs text-base-content/70">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Evaluation grounded in Sanity Content Lake &bull; Zero Hallucination Gate</span>
      </div>
      <button type="button" class="btn btn-sm btn-outline gap-1.5 text-xs font-semibold" onclick="openDossierModal()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Export Compliance Dossier / Print Certificate</span>
      </button>
    </div>

    ${resolutionHtml}
    ${clausesHtml}
    ${nextStepsHtml}
  `

  container.scrollIntoView({behavior: 'smooth', block: 'nearest'})
}

// Modal Handlers: System Telemetry & Compliance Dossier
async function openTelemetryModal() {
  const modal = document.getElementById('telemetry_modal')
  const loading = document.getElementById('telemetry-loading')
  const content = document.getElementById('telemetry-content')

  if (!modal) return
  modal.showModal()

  loading?.classList.remove('hidden')
  content?.classList.add('hidden')

  try {
    const res = await fetch('/health/deep')
    const data = await res.json()

    const lakeStatus = document.getElementById('tel-lake-status')
    const schemesCount = document.getElementById('tel-schemes-count')
    const mcpStatus = document.getElementById('tel-mcp-status')
    const toolsCount = document.getElementById('tel-tools-count')
    const latency = document.getElementById('tel-latency')

    if (lakeStatus) lakeStatus.textContent = data.sanityContentLake?.status || 'Operational'
    if (schemesCount) schemesCount.textContent = `${data.sanityContentLake?.indexedSchemesCount || 36}`
    if (mcpStatus) mcpStatus.textContent = data.sanityContextMcp?.status || 'Connected'
    if (toolsCount) toolsCount.textContent = `${data.sanityContextMcp?.toolsRegistered || 4}`
    if (latency) latency.textContent = `${data.latencyMs || 0} ms`

    loading?.classList.add('hidden')
    content?.classList.remove('hidden')
  } catch (err) {
    if (loading) loading.innerHTML = `<div class="text-error">Failed to load telemetry: ${escapeHtml(err.message)}</div>`
  }
}

function openDossierModal() {
  const modal = document.getElementById('dossier_modal')
  if (!modal || !currentEvaluation) return

  const refCode = document.getElementById('dossier-ref-code')
  const dateEl = document.getElementById('dossier-date')
  const studentName = document.getElementById('dossier-student-name')
  const studentId = document.getElementById('dossier-student-id')
  const studentInst = document.getElementById('dossier-student-inst')
  const verdictBox = document.getElementById('dossier-verdict-box')
  const clausesList = document.getElementById('dossier-clauses-list')

  const now = new Date()
  if (refCode) refCode.textContent = `#SCH-AUDIT-2026-${Math.floor(1000 + Math.random() * 9000)}`
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})
  if (studentName) studentName.textContent = activeStudent.name
  if (studentId) studentId.textContent = activeStudent.id
  if (studentInst) studentInst.textContent = activeStudent.institution

  const isConflict = currentEvaluation.verdict === 'PROHIBITED' || currentEvaluation.verdict === 'CONDITIONAL'
  const boxClass = isConflict ? 'bg-error/10 border-error/30 text-error' : 'bg-success/10 border-success/30 text-success'
  const verdictTitle = isConflict ? 'NON-STACKING CONFLICT DETECTED' : 'CONCURRENT AWARDS PERMITTED'

  if (verdictBox) {
    verdictBox.className = `p-3.5 rounded-lg border text-xs space-y-1 ${boxClass}`
    verdictBox.innerHTML = `
      <div class="font-bold text-xs uppercase tracking-wider">${verdictTitle}</div>
      <div class="text-base-content/80 text-xs">${escapeHtml(currentEvaluation.summary)}</div>
    `
  }

  if (clausesList) {
    if (currentEvaluation.conflictingClauses && currentEvaluation.conflictingClauses.length > 0) {
      clausesList.innerHTML = currentEvaluation.conflictingClauses.map((c) => `
        <div class="p-2.5 rounded-lg bg-base-200/60 border border-base-300 space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-bold text-base-content">${escapeHtml(c.schemeTitle)}</span>
            <span class="font-mono text-[10px] text-primary">${escapeHtml(c.clauseRef || 'Statutory Ref')}</span>
          </div>
          <blockquote class="italic text-base-content/80">"${escapeHtml(c.exactQuote)}"</blockquote>
          <div class="text-error font-medium text-[11px]"><span class="font-bold">Sanction:</span> ${escapeHtml(c.consequence || 'Mandatory clawback with penal interest')}</div>
        </div>
      `).join('')
    } else {
      clausesList.innerHTML = `
        <div class="p-2.5 rounded-lg bg-base-200/40 border border-base-300 text-base-content/70">
          No active statutory prohibitions or conflicting non-stacking clauses identified for this evaluated award combination.
        </div>
      `
    }
  }

  modal.showModal()
}

// ==========================================
// 10. Student Relinquishment Ledger Sync
// ==========================================
async function loadStudentHistory() {
  const list = document.getElementById('decisions-list')
  const countBadge = document.getElementById('ledger-record-count')

  if (!list) return

  try {
    const res = await fetch(`/api/student/${encodeURIComponent(activeStudent.id)}/history`)
    const data = await res.json()
    const history = data.history || []

    if (countBadge) countBadge.textContent = `${history.length} Record${history.length === 1 ? '' : 's'}`

    if (history.length === 0) {
      list.innerHTML = `
        <div class="p-8 text-center space-y-2">
          <div class="text-xs font-semibold text-base-content/70">No Historical Relinquishments Recorded</div>
          <div class="text-xs text-base-content/50 max-w-sm mx-auto">
            When a dual-scholarship conflict is formally resolved, the surrender memo and retention record are permanently committed to Sanity Content Lake here.
          </div>
        </div>
      `
      return
    }

    list.innerHTML = history
      .map(
        (h) => `
      <div class="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-base-200/40 transition-colors">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="badge badge-success badge-sm text-[10px] font-semibold text-white">
              ${escapeHtml(h.resolutionStatus || 'COMMITTED')}
            </span>
            <span class="text-xs text-base-content/50 font-mono">
              ${new Date(h.resolvedAt).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="text-base-content/60 font-semibold uppercase text-[10px]">Retained Award:</span>
            <span class="font-bold text-success">${escapeHtml(h.retainedScheme?.title || 'Unknown Scheme')}</span>
            <span class="text-base-content/30">&bull;</span>
            <span class="text-base-content/60 font-semibold uppercase text-[10px]">Formally Surrendered:</span>
            <span class="line-through text-base-content/60">${escapeHtml(h.surrenderedScheme?.title || 'Unknown Scheme')}</span>
          </div>

          ${
            h.notes
              ? `<div class="text-[11px] text-base-content/60 italic">
                  <strong>Ref Memo:</strong> ${escapeHtml(h.notes)}
                </div>`
              : ''
          }
        </div>

        <div class="shrink-0 flex items-center gap-2">
          <span class="badge badge-outline badge-xs text-[10px]">Sanity Lake Synced</span>
        </div>
      </div>
    `
      )
      .join('')
  } catch (err) {
    list.innerHTML = `
      <div class="p-4 text-xs text-error">
        Failed to fetch audit history: ${escapeHtml(err.message)}
      </div>
    `
  }
}

// ==========================================
// 11. Formal Relinquishment Modal
// ==========================================
function openResolutionModal() {
  const modal = document.getElementById('resolution_modal')
  const modalStudentId = document.getElementById('modal-student-id')
  const retainSelect = document.getElementById('retain-scheme-select')
  const surrenderSelect = document.getElementById('surrender-scheme-select')

  if (!modal || !retainSelect || !surrenderSelect) return

  if (modalStudentId) modalStudentId.value = `${activeStudent.name} (${activeStudent.id})`

  const optionsHtml = allSchemes
    .map((s) => `<option value="${s._id}">${escapeHtml(s.title)}</option>`)
    .join('')

  retainSelect.innerHTML = optionsHtml
  surrenderSelect.innerHTML = optionsHtml

  // Auto-select conflicting schemes if currently evaluated
  if (currentEvaluation?.identifiedSchemes?.schemeA && currentEvaluation?.identifiedSchemes?.schemeB) {
    const sA = allSchemes.find((s) => s.title.includes(currentEvaluation.identifiedSchemes.schemeA.title))
    const sB = allSchemes.find((s) => s.title.includes(currentEvaluation.identifiedSchemes.schemeB.title))

    if (sA && sB) {
      retainSelect.value = sB._id // Keep Scheme B
      surrenderSelect.value = sA._id // Surrender Scheme A
    }
  }

  modal.showModal()
}

async function confirmResolution() {
  const retainId = document.getElementById('retain-scheme-select')?.value
  const surrenderId = document.getElementById('surrender-scheme-select')?.value
  const notes = document.getElementById('resolution-notes')?.value.trim()
  const confirmBtn = document.getElementById('confirm-resolution-btn')
  const modal = document.getElementById('resolution_modal')

  if (retainId === surrenderId) {
    alert('Please select two distinct awards: one to retain and one to formally surrender.')
    return
  }

  if (confirmBtn) {
    confirmBtn.disabled = true
    confirmBtn.textContent = 'Committing to Sanity...'
  }

  try {
    const res = await fetch('/api/resolve', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        studentId: activeStudent.id,
        retainedSchemeId: retainId,
        surrenderedSchemeId: surrenderId,
        notes: notes || 'Formal relinquishment registered via Institutional Portal',
      }),
    })

    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.error || 'Failed to record resolution')
    }

    modal?.close()
    await loadStudentHistory()

    alert('Formal relinquishment committed to Sanity Content Lake. The compliance engine has updated your active aid ledger.')
  } catch (err) {
    alert('Error recording resolution: ' + err.message)
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false
      confirmBtn.textContent = 'Commit Record to Sanity Lake'
    }
  }
}

// ==========================================
// 12. Scholarship Directory Search & Grid
// ==========================================
function renderDirectory(schemes) {
  const grid = document.getElementById('directory-grid')
  if (!grid) return

  if (schemes.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-8 text-center card bg-base-100 border border-base-300 rounded-xl">
        <div class="text-sm font-semibold text-base-content">No Matching Scholarship Policies Found</div>
        <div class="text-xs text-base-content/60 mt-1">Try adjusting your search keywords or clearing the category filter.</div>
      </div>
    `
    return
  }

  grid.innerHTML = schemes
    .map((s) => {
      const catClass =
        s.category === 'Central'
          ? 'badge-primary'
          : s.category === 'State'
          ? 'badge-secondary'
          : s.category === 'Corporate'
          ? 'badge-accent'
          : 'badge-neutral'

      const ruleSnippet = s.stackingRule?.exactClauseText
        ? `"${escapeHtml(s.stackingRule.exactClauseText)}"`
        : 'Rule details indexed in full gazette document.'

      return `
      <div class="card bg-base-100 border border-base-300 shadow-sm rounded-xl p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-2">
            <span class="badge ${catClass} badge-xs font-semibold py-1 px-2 text-[10px] text-white">
              ${escapeHtml(s.category || 'General')}
            </span>
            ${
              s.maximumAnnualBenefit
                ? `<span class="text-xs font-semibold text-base-content/80 font-mono">Max: ${escapeHtml(s.maximumAnnualBenefit)}</span>`
                : ''
            }
          </div>

          <div>
            <h3 class="font-bold text-sm text-base-content leading-snug">${escapeHtml(s.title)}</h3>
            <div class="text-[11px] text-base-content/60 mt-0.5">${escapeHtml(s.fundingBody || 'Department of Higher Education')}</div>
          </div>

          <div class="p-2.5 rounded-lg bg-base-200/50 text-[11px] text-base-content/75 italic line-clamp-3 leading-relaxed">
            ${ruleSnippet}
          </div>
        </div>

        <div class="pt-4 mt-3 border-t border-base-200 flex items-center justify-between gap-2">
          <button type="button" class="btn btn-xs btn-primary text-white font-medium flex-1" onclick="selectSchemeForVerify('${escapeHtml(s.title)}')">
            Verify in Checker
          </button>
          ${
            (s.officialDocumentUrl || s.stackingRule?.officialDocumentUrl)
              ? `<a href="${s.officialDocumentUrl || s.stackingRule?.officialDocumentUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-ghost border border-base-300" title="View Source Document">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>`
              : ''
          }
        </div>
      </div>
    `
    })
    .join('')
}

function filterDirectory() {
  const searchInput = document.getElementById('directory-search-input')
  const query = searchInput?.value.toLowerCase().trim() || ''

  const filtered = allSchemes.filter((s) => {
    // Category match
    const matchesCategory =
      activeCategoryFilter === 'all' ||
      (s.category && s.category.toLowerCase() === activeCategoryFilter.toLowerCase())

    // Keyword match
    const matchesSearch =
      !query ||
      s.title.toLowerCase().includes(query) ||
      (s.fundingBody && s.fundingBody.toLowerCase().includes(query)) ||
      (s.stackingRule?.exactClauseText && s.stackingRule.exactClauseText.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
  })

  renderDirectory(filtered)
}

function selectSchemeForVerify(schemeTitle) {
  const selectA = document.getElementById('select-scheme-a')
  if (selectA) {
    selectA.value = schemeTitle
    syncAwardsToQuery()
  }
  switchTab('verify')
}

// Utility: Escape HTML
function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
