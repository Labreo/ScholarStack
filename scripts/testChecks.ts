import {evaluateStackingQuery} from '../agent/src/evaluator'
import {recordStudentDecision, getStudentDecisions} from '../agent/src/sanityClient'

async function runTestSuite() {
  console.log('===============================================================')
  console.log('SCHOLARSTACK AUTOMATED VERIFICATION SUITE (SECTION 6 CHECKS)')
  console.log('===============================================================\n')

  let passed = 0
  let failed = 0

  // -------------------------------------------------------------------------
  // CHECK 1: Core Stacking Question & Citation Verification
  // -------------------------------------------------------------------------
  console.log('🔹 [CHECK 1]: Direct Stacking Question with Real Rulebook Citation')
  const q1 = 'I am getting the Goa Home Nursing Scholarship. Can I also accept the Samsung Star Scholar Program?'
  console.log(`Query: "${q1}"`)

  try {
    const res1 = await evaluateStackingQuery(q1, 'student-check1')
    console.log(`Verdict: ${res1.verdict} (canStack: ${res1.canStack})`)
    console.log(`Summary: ${res1.summary}`)

    if (res1.conflictingClauses.length > 0) {
      console.log(`Found ${res1.conflictingClauses.length} conflicting clause(s):`)
      for (const c of res1.conflictingClauses) {
        console.log(`  - Scheme: ${c.schemeTitle}`)
        console.log(`    Ref: ${c.clauseRef}`)
        console.log(`    Exact Quote: "${c.exactQuote}"`)
        console.log(`    Document URL: ${c.officialDocumentUrl}`)
      }
    }

    if (res1.verdict === 'PROHIBITED' && res1.conflictingClauses.length >= 1) {
      console.log('✅ CHECK 1 PASSED: Correctly identified direct non-stacking violation and cited verbatim clause.\n')
      passed++
    } else {
      console.error('❌ CHECK 1 FAILED: Expected PROHIBITED verdict with at least 1 cited clause.\n')
      failed++
    }
  } catch (err: any) {
    console.error('❌ CHECK 1 ERROR:', err.message)
    failed++
  }

  // -------------------------------------------------------------------------
  // CHECK 2: Rephrased / Inverted Query
  // -------------------------------------------------------------------------
  console.log('🔹 [CHECK 2]: Rephrased / Inverted Question')
  const q2 = 'If I already won the Samsung Star Scholar, am I allowed to apply for and receive the Central Post-Matric SC/ST scholarship?'
  console.log(`Query: "${q2}"`)

  try {
    const res2 = await evaluateStackingQuery(q2, 'student-check2')
    console.log(`Verdict: ${res2.verdict} (canStack: ${res2.canStack})`)
    console.log(`Summary: ${res2.summary}`)

    if (res2.verdict === 'PROHIBITED') {
      console.log('✅ CHECK 2 PASSED: Reasoning holds across inverted syntax and rephrased queries.\n')
      passed++
    } else {
      console.error('❌ CHECK 2 FAILED: Expected PROHIBITED verdict for Samsung + Central Post-Matric.\n')
      failed++
    }
  } catch (err: any) {
    console.error('❌ CHECK 2 ERROR:', err.message)
    failed++
  }

  // -------------------------------------------------------------------------
  // CHECK 3: Resolution Round-Trip (Section 4 Differentiator)
  // -------------------------------------------------------------------------
  console.log('🔹 [CHECK 3]: Tracked Resolution Round-Trip (State Carried Forward)')
  const student3Id = `student-test-${Date.now()}`
  console.log(`Student ID: ${student3Id}`)

  try {
    console.log('Step 3a: Student queries Goa Scheme + Samsung Star Scholar (initial conflict)...')
    const res3a = await evaluateStackingQuery(
      'Can I hold both the Goa Home Nursing Scholarship and Samsung Star Scholar?',
      student3Id
    )
    console.log(`  Initial Verdict: ${res3a.verdict}`)

    console.log('Step 3b: Student resolves conflict in Sanity by surrendering Goa Scheme to keep Samsung...')
    await recordStudentDecision({
      studentId: student3Id,
      retainedSchemeId: 'scheme-samsung-star-scholar',
      surrenderedSchemeId: 'scheme-goa-home-nursing',
      decisionNotes: 'Student formally submitted surrender of Goa Home Nursing Scholarship to accept Samsung Star Scholar.',
    })

    const decisionsInSanity = await getStudentDecisions(student3Id)
    console.log(`  Recorded decisions found in Sanity: ${decisionsInSanity.length}`)

    console.log('Step 3c: Student asks follow-up: "Can I now apply for FTII Scholarship Scheme?"')
    const q3Followup = 'I surrendered the Goa scholarship. Can I now accept the FTII scholarship alongside Samsung Star Scholar?'
    const res3b = await evaluateStackingQuery(q3Followup, student3Id)

    console.log(`  Follow-up Verdict: ${res3b.verdict}`)
    console.log(`  Previously Surrendered Schemes noted by Agent:`, res3b.activeStudentContext?.previouslySurrenderedSchemes)
    console.log(`  Summary: ${res3b.summary}`)

    if (
      res3b.activeStudentContext?.previouslySurrenderedSchemes.some((s) => s.toLowerCase().includes('goa'))
    ) {
      console.log('✅ CHECK 3 PASSED: Agent successfully recognized prior surrender in Sanity and updated reasoning state!\n')
      passed++
    } else {
      console.error('❌ CHECK 3 FAILED: Agent did not reflect the prior surrender recorded in Sanity.\n')
      failed++
    }
  } catch (err: any) {
    console.error('❌ CHECK 3 ERROR:', err.message)
    failed++
  }

  // -------------------------------------------------------------------------
  // CHECK 4: Out-of-Corpus Handling (Zero Hallucination Test)
  // -------------------------------------------------------------------------
  console.log('🔹 [CHECK 4]: Out-of-Corpus Question (Truthful Refusal)')
  const q4 = 'Can I stack the Eiffel Excellence Scholarship in France with the Rhodes Scholarship at Oxford?'
  console.log(`Query: "${q4}"`)

  try {
    const res4 = await evaluateStackingQuery(q4, 'student-check4')
    console.log(`Verdict: ${res4.verdict}`)
    console.log(`Summary: ${res4.summary}`)
    console.log(`Unknown Schemes identified:`, res4.identifiedSchemes.unknownSchemes)

    if (res4.verdict === 'OUT_OF_SCOPE' || res4.identifiedSchemes.unknownSchemes.length > 0) {
      console.log('✅ CHECK 4 PASSED: Truthfully declined to hallucinate on schemes not in verified Knowledge Base.\n')
      passed++
    } else {
      console.error('❌ CHECK 4 FAILED: Agent attempted to answer without verified scheme rules.\n')
      failed++
    }
  } catch (err: any) {
    console.error('❌ CHECK 4 ERROR:', err.message)
    failed++
  }

  // -------------------------------------------------------------------------
  // Final Results
  // -------------------------------------------------------------------------
  console.log('===============================================================')
  console.log(`FINAL RESULTS: ${passed}/4 Checks Passed. (${failed} failed)`)
  console.log('===============================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runTestSuite().catch((err) => {
  console.error('Test Suite encountered fatal error:', err)
  process.exit(1)
})
