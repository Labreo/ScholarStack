import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({path: path.resolve(process.cwd(), '.env')})

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_PROJECT_TOKEN

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_PROJECT_TOKEN in .env')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

export const verifiedSchemes = [
  {
    _id: 'scheme-goa-home-nursing',
    _type: 'scholarshipScheme',
    title: 'Directorate of Social Welfare Goa - Scholarship for Home Nursing Courses',
    slug: {current: 'goa-home-nursing-scholarship'},
    authority: 'Directorate of Social Welfare, Government of Goa',
    category: 'state',
    officialDocumentUrl: 'https://socialwelfare.goa.gov.in/wp-content/uploads/2025/04/Scheme-of-Scholarship-to-students-pursuing-home-nursing-Courses.pdf',
    documentTitle: 'Notification 13-1-84-SWD/Part/2025 - Scheme of Scholarship to Students Pursuing Home Nursing Courses',
    summary: 'State financial stipend scheme for Goan resident students enrolled in recognized home nursing training institutes.',
    benefits: 'Monthly stipend of Rs. 2,000/- for pursuing home nursing training.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A scholarship holder under this scheme shall not avail any other scholarship/stipend for pursuing the same course.',
      clauseReference: 'Clause 7(b), Conditions of Award',
      consequenceOfViolation: 'Immediate termination of scholarship and forfeiture of eligibility under state welfare schemes.',
      allowedExceptions: 'None. Absolute prohibition on holding concurrent scholarships or stipends for the same course.',
    },
  },
  {
    _id: 'scheme-samsung-star-scholar',
    _type: 'scholarshipScheme',
    title: 'Samsung Star Scholar CSR Program',
    slug: {current: 'samsung-star-scholar'},
    authority: 'Samsung India Electronics Pvt. Ltd. (CSR Division)',
    category: 'corporate',
    officialDocumentUrl: 'https://images.samsung.com/is/content/samsung/assets/in/microsite/sapne-hue-bade/stories/StarScholarRuleBook.pdf',
    documentTitle: 'Samsung Star Scholar Program - Rules and Regulations Rulebook',
    summary: 'Corporate CSR merit scholarship supporting meritorious students from Navodaya Vidyalayas pursuing B.Tech/Dual Degree at IITs and NITs.',
    benefits: 'Financial support of up to INR 2,00,000/- per academic year covering tuition, hostel, and mess expenses.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The student shall not avail any other financial assistance or scholarship from any Institute, Government or Non-Government source during the tenure of the scholarship.',
      clauseReference: 'Rulebook Section 4.3 (Disqualification & Forfeiture)',
      consequenceOfViolation: 'Immediate revocation of scholarship, debarment from Samsung CSR initiatives, and forfeiture of all unpaid tranches.',
      allowedExceptions: 'Strict zero-tolerance clause; no concurrent financial assistance permitted from any institute, government, or private body.',
    },
  },
  {
    _id: 'scheme-central-post-matric-sc-st-obc',
    _type: 'scholarshipScheme',
    title: 'Central Sector Post-Matric Scholarship for SC/ST/OBC Students',
    slug: {current: 'central-post-matric-sc-st-obc'},
    authority: 'Ministry of Social Justice & Empowerment, Government of India',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/hi/schemes/presm',
    documentTitle: 'Centrally Sponsored Post Matric Scholarship Scheme Guidelines (NSP Routed)',
    summary: 'Pan-India post-matric scheme enabling marginalized students to pursue higher education with full fee support.',
    benefits: 'Full non-refundable compulsory course fee reimbursement plus monthly maintenance allowance.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The student must not be availing any other scholarship by the govt. If found receiving another government scholarship simultaneously, the scholarship will be cancelled immediately and the entire amount disbursed will be recovered.',
      clauseReference: 'Rule 5.1(iv) & Clause 9 (Recovery & Cancellation)',
      consequenceOfViolation: 'Immediate cancellation of award and mandatory statutory recovery/clawback of all disbursed funds.',
      allowedExceptions: 'No concurrent government scholarships permitted. Free-ship cards must be reconciled through NSP.',
    },
  },
  {
    _id: 'scheme-pm-yasasvi-pre-matric',
    _type: 'scholarshipScheme',
    title: 'PM YASASVI Pre-Matric Scholarship Scheme for OBC, EBC & DNT Students',
    slug: {current: 'pm-yasasvi-pre-matric'},
    authority: 'Ministry of Social Justice & Empowerment, Government of India',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/hi/schemes/pmyasasvipmsobcebcdnts',
    documentTitle: 'PM-YASASVI Scheme Guidelines, Department of Social Justice and Empowerment',
    summary: 'Pre-matric education assistance for students in classes 9 and 10 from marginalized communities.',
    benefits: 'Academic allowance of Rs. 4,000/- per annum.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A scholarship holder under this scheme will not hold any other educational scholarship for the same stage of education. If awarded any other educational scholarship, the student can avail of either of the two scholarships as per his/her choice.',
      clauseReference: 'Clause 8 (Conditions of Eligibility)',
      consequenceOfViolation: 'Disqualification if both are accepted; student must officially surrender one scheme.',
      allowedExceptions: 'Formal choice allowed: student may choose to retain either scholarship by surrendering the other in writing.',
    },
  },
  {
    _id: 'scheme-iit-guwahati-mcm',
    _type: 'scholarshipScheme',
    title: 'IIT Guwahati Merit-cum-Means Institute Scholarship',
    slug: {current: 'iit-guwahati-mcm-scholarship'},
    authority: 'Indian Institute of Technology Guwahati (Senate)',
    category: 'institute',
    officialDocumentUrl: 'https://www.iitg.ac.in/fresherportal/ScholarshipOrdinance.pdf',
    documentTitle: 'IIT Guwahati Ordinances on Scholarships, Stipends, Medals and Prizes',
    summary: 'Merit-cum-means scholarship for undergraduate students admitted to B.Tech/B.Des programs at IIT Guwahati.',
    benefits: 'Full tuition fee waiver and monthly stipend allowance of Rs. 1,000/-.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A student shall not ordinarily receive any other scholarship, stipend, financial assistance, freeship or remuneration from any other source except with the prior permission of the competent authority.',
      clauseReference: 'Ordinance Section 2, Rule 6(a)',
      consequenceOfViolation: 'Cancellation of MCM award and disciplinary review by Senate unless prior permission was secured.',
      allowedExceptions: 'Permitted ONLY with prior written permission of the competent authority (Dean of Students Affairs / Senate).',
    },
  },
  {
    _id: 'scheme-ftii-scholarship',
    _type: 'scholarshipScheme',
    title: 'Film and Television Institute of India (FTII) Student Scholarship Scheme',
    slug: {current: 'ftii-scholarship-scheme'},
    authority: 'Film and Television Institute of India, Ministry of I&B',
    category: 'institute',
    officialDocumentUrl: 'https://ftii.ac.in/api/serve/2026/06/19/03._Scholarship_-_Rules_and_Regulation_1.pdf',
    documentTitle: 'FTII Scholarship Rules and Regulation Document No. 03',
    summary: 'Institute scholarship and freeship support for film and television diploma students.',
    benefits: 'Partial to full tuition fee waiver plus academic project grant.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A student shall not receive more than one scholarship/assistantship/freeship except for scholarships sponsored by Centre or State Government. In case a student is offered another scholarship, they must make a formal written choice within 15 days.',
      clauseReference: 'Regulation 4.2 & Procedure 5',
      consequenceOfViolation: 'Automated forfeiture of the institute scholarship upon failure to exercise written option within 15 days.',
      allowedExceptions: 'Explicitly permits concurrent Centre or State government scholarships (stacking allowed with government schemes).',
    },
  },
]

async function seed() {
  console.log(`Starting corpus seed into Sanity project: ${projectId}, dataset: ${dataset}...`)
  const tx = client.transaction()
  for (const scheme of verifiedSchemes) {
    tx.createOrReplace(scheme)
  }
  const result = await tx.commit()
  console.log(`Successfully seeded ${result.results.length} verified scholarship schemes!`)
  for (const s of verifiedSchemes) {
    console.log(` - [${s.category.toUpperCase()}] ${s.title}`)
    console.log(`   Quote: "${s.stackingRule.exactClauseText.slice(0, 75)}..."`)
  }
}

seed().catch((err) => {
  console.error('Failed to seed corpus:', err)
  process.exit(1)
})
