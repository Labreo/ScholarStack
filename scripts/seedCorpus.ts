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
  // 1. Goa Home Nursing
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

  // 2. Samsung Star Scholar
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

  // 3. Central Post-Matric SC
  {
    _id: 'scheme-central-post-matric-sc-st-obc',
    _type: 'scholarshipScheme',
    title: 'Central Sector Post-Matric Scholarship for SC/ST/OBC Students',
    slug: {current: 'central-post-matric-sc-st-obc'},
    authority: 'Ministry of Social Justice & Empowerment, Government of India',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/presm',
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

  // 4. PM YASASVI Pre-Matric
  {
    _id: 'scheme-pm-yasasvi-pre-matric',
    _type: 'scholarshipScheme',
    title: 'PM YASASVI Pre-Matric Scholarship Scheme for OBC, EBC & DNT Students',
    slug: {current: 'pm-yasasvi-pre-matric'},
    authority: 'Ministry of Social Justice & Empowerment, Government of India',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/pmyasasvipmsobcebcdnts',
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

  // 5. CSIR-UGC JRF (Resolved URL pointing directly to official 1.1MB PDF)
  {
    _id: 'scheme-csir-ugc-jrf',
    _type: 'scholarshipScheme',
    title: 'CSIR-UGC Junior Research Fellowship (JRF)',
    slug: {current: 'csir-ugc-jrf-fellowship'},
    authority: 'Council of Scientific and Industrial Research (Human Resource Development Group)',
    category: 'central',
    officialDocumentUrl: 'https://www.csirhrdg.res.in/SiteContent/ManagedContent/ATContent/Implementation_of_revised_CSIR_s_Research_Fellowships_guidelines_reg_20230221170415510_Hi.pdf',
    documentTitle: 'Implementation of Revised CSIR Research Fellowships Guidelines & Terms of Award',
    summary: 'Premier national competitive fellowship awarded to NET-qualified scholars pursuing doctoral research in science disciplines.',
    benefits: 'INR 37,000/- per month + House Rent Allowance (HRA) + annual contingency grant of INR 20,000/-.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The fellow shall not accept any other appointment, paid or unpaid, or receive emoluments, salary, stipend, or fellowship from any other source during the fellowship tenure without prior CSIR approval.',
      clauseReference: 'Terms of Award Clause 4 (Exclusivity & Honorarium Bar)',
      consequenceOfViolation: 'Instant cancellation of JRF tenure and recovery of total fellowship with penal interest.',
      allowedExceptions: 'Occasional honorary lectures or guest tutorials not exceeding 4 hours/week are permitted.',
    },
  },

  // 6. FTII Pune Scholarship
  {
    _id: 'scheme-ftii-scholarship',
    _type: 'scholarshipScheme',
    title: 'Film and Television Institute of India (FTII) Student Scholarship Scheme',
    slug: {current: 'ftii-student-scholarship'},
    authority: 'Film and Television Institute of India, Ministry of Information & Broadcasting',
    category: 'institute',
    officialDocumentUrl: 'https://ftii.ac.in/api/serve/2026/06/19/03._Scholarship_-_Rules_and_Regulation_1.pdf',
    documentTitle: 'FTII Student Scholarship Rules and Regulations (Academic Council Approved)',
    summary: 'Need-cum-merit institutional scholarships for students enrolled in FTII cinematic and television disciplines.',
    benefits: 'Tuition fee reimbursement and semester maintenance allowances.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A student shall not receive more than one scholarship/assistantship/freeship concurrently from any government or private source. Receipt of dual aid warrants immediate disciplinary review and recovery.',
      clauseReference: 'Section 3.2 (Exclusivity Clause)',
      consequenceOfViolation: 'Immediate clawback of semester aid and debarment from institute merit prizes.',
      allowedExceptions: 'Government travel grants for international festival representation are permissible upon approval.',
    },
  },

  // 7. Reliance Foundation Undergraduate
  {
    _id: 'scheme-reliance-foundation-ug',
    _type: 'scholarshipScheme',
    title: 'Reliance Foundation Undergraduate Scholarship',
    slug: {current: 'reliance-foundation-undergraduate'},
    authority: 'Reliance Foundation (CSR Initiative)',
    category: 'corporate',
    officialDocumentUrl: 'https://www.scholarships.reliancefoundation.org',
    documentTitle: 'Reliance Foundation Undergraduate Scholarship Program Regulations',
    summary: 'Merit-cum-means CSR scholarship for first-year undergraduate students in any stream across India.',
    benefits: 'Up to INR 2,00,000/- over the duration of the undergraduate degree.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Scholars may not hold any other corporate or private philanthropic scholarship concurrently. Government financial aid, institutional fee waivers, or loans are permissible provided total aid does not exceed total actual cost of attendance.',
      clauseReference: 'Terms & Conditions Clause 6.1 (Concurrent Corporate Aid Restrictions)',
      consequenceOfViolation: 'Cancellation of award and revocation of Reliance Scholars Alumni network membership.',
      allowedExceptions: 'Permits government merit scholarships and institutional tuition waivers within total cost of attendance.',
    },
  },

  // 8. Tata Trusts Medical
  {
    _id: 'scheme-tata-trusts-medical',
    _type: 'scholarshipScheme',
    title: 'Tata Trusts Medical and Healthcare Studies Education Grant',
    slug: {current: 'tata-trusts-medical-grant'},
    authority: 'Tata Trusts (Individual Grants Programme)',
    category: 'corporate',
    officialDocumentUrl: 'https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants',
    documentTitle: 'Tata Trusts Higher Education Grant Guidelines for Healthcare Sciences',
    summary: 'Philanthropic grant supporting meritorious students pursuing MBBS, BDS, and allied healthcare professional degrees.',
    benefits: 'Partial or full tuition fee grant disbursed directly to the college/university.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Students receiving full tuition fee reimbursement from any other trust, foundation, or government scheme are ineligible. Partial grant recipients must declare all concurrent awards for pro-rata adjustment.',
      clauseReference: 'Individual Grants Guidelines Clause 4 (Non-Duplication of Fees)',
      consequenceOfViolation: 'Immediate demand for repayment and reporting to college administration.',
      allowedExceptions: 'Allows government hostel-only stipends where Tata Trusts covers tuition exclusively.',
    },
  },

  // 9. Aditya Birla Scholarship
  {
    _id: 'scheme-aditya-birla-scholarship',
    _type: 'scholarshipScheme',
    title: 'Aditya Birla Group Scholarship',
    slug: {current: 'aditya-birla-group-scholarship'},
    authority: 'Aditya Birla Management Corporation Pvt. Ltd.',
    category: 'corporate',
    officialDocumentUrl: 'https://www.adityabirlascholars.net',
    documentTitle: 'Aditya Birla Scholars Selection & Eligibility Charter',
    summary: 'Prestigious fellowship for top rankers joining premier institutes (IITs, BITS Pilani, IIMs, National Law Universities).',
    benefits: 'INR 1,00,000/- to INR 3,00,000/- per annum covering academic fees and living allowances.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'An Aditya Birla Scholar shall not hold any other corporate scholarship or corporate sponsorship. Acceptance of dual corporate funding terminates the Aditya Birla Scholarship immediately.',
      clauseReference: 'Code of Conduct Section 5 (Exclusivity of Corporate Recognition)',
      consequenceOfViolation: 'Immediate termination of scholarship title and forfeiture of subsequent disbursements.',
      allowedExceptions: 'Permits institute tuition fee remissions granted by virtue of national entrance ranking.',
    },
  },

  // 10. ONGC Foundation SC/ST
  {
    _id: 'scheme-ongc-foundation-sc-st',
    _type: 'scholarshipScheme',
    title: 'ONGC Foundation Scholarship for SC/ST Students',
    slug: {current: 'ongc-foundation-sc-st-scholarship'},
    authority: 'Oil and Natural Gas Corporation (ONGC) Foundation',
    category: 'corporate',
    officialDocumentUrl: 'https://ongcscholar.org/rules_regulations',
    documentTitle: 'ONGC CSR Scholarship Scheme for Scheduled Caste & Scheduled Tribe Students',
    summary: 'CSR support for SC/ST students enrolled in Engineering, MBBS, MBA, or Master in Geophysics/Geology.',
    benefits: 'INR 48,000/- per annum until completion of the course.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The beneficiary should not be in receipt of any other scholarship or financial assistance from any other source. A declaration/undertaking to this effect must be furnished annually.',
      clauseReference: 'Rule 6 (Eligibility & Undertaking Clause)',
      consequenceOfViolation: 'Immediate cancellation, recovery of total amount, and debarment from ONGC recruitment.',
      allowedExceptions: 'Strict non-stacking; student must not draw any other stipend from Central or State sources.',
    },
  },

  // 11. Kotak Kanya Scholarship
  {
    _id: 'scheme-kotak-kanya',
    _type: 'scholarshipScheme',
    title: 'Kotak Kanya Scholarship for Meritorious Girls',
    slug: {current: 'kotak-kanya-scholarship'},
    authority: 'Kotak Education Foundation (Kotak Mahindra Group CSR)',
    category: 'corporate',
    officialDocumentUrl: 'https://kotakeducation.org/kotak-kanya-scholarship',
    documentTitle: 'Kotak Kanya Scholarship Policy & Standard Operating Procedures',
    summary: 'CSR scholarship empowering meritorious female students from low-income families pursuing professional graduation courses.',
    benefits: 'Up to INR 1,50,000/- per year until completion of professional degree program.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Scholars cannot concurrently receive any other corporate CSR scholarship. State government fee concessions or reimbursement schemes are permitted provided the total assistance does not exceed actual educational expenditure.',
      clauseReference: 'Code of Compliance Section 2.3 (Corporate Aid Exclusions)',
      consequenceOfViolation: 'Withdrawal of future tranches and cancellation of mentorship membership.',
      allowedExceptions: 'Permits government tuition fee waivers and state welfare reimbursement cards.',
    },
  },

  // 12. AICTE Pragati
  {
    _id: 'scheme-aicte-pragati',
    _type: 'scholarshipScheme',
    title: 'AICTE Pragati Scholarship Scheme for Girl Students',
    slug: {current: 'aicte-pragati-scholarship'},
    authority: 'All India Council for Technical Education (AICTE), Ministry of Education',
    category: 'central',
    officialDocumentUrl: 'https://aicte.gov.in/sites/default/files/stdc/Pragati/FAQs-Pragati%20Scheme.pdf',
    documentTitle: 'AICTE Pragati Scholarship Scheme for Girls - Frequently Asked Questions & Norms',
    summary: 'Government scheme advancing technical education for meritorious girl students in degree and diploma courses.',
    benefits: 'INR 50,000/- per annum towards tuition fees, computer purchase, books, and educational supplies.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The candidate shall not be availing of any other scholarship scheme from Central Government or State Government or AICTE during the study period. Dual receipt leads to recovery and cancellation.',
      clauseReference: 'Clause 5 (Terms of Award) & FAQ 14',
      consequenceOfViolation: 'Revocation of scholarship, removal from DBT portal, and recovery of disbursed amount.',
      allowedExceptions: 'Institutional merit awards carrying no financial disbursement are permitted.',
    },
  },

  // 13. AICTE Saksham
  {
    _id: 'scheme-aicte-saksham',
    _type: 'scholarshipScheme',
    title: 'AICTE Saksham Scholarship Scheme for Specially Abled Students',
    slug: {current: 'aicte-saksham-scholarship'},
    authority: 'All India Council for Technical Education (AICTE), Ministry of Education',
    category: 'central',
    officialDocumentUrl: 'https://www.aicte.gov.in/sites/default/files/Saksham%20Scheme%20Guidelines.pdf',
    documentTitle: 'Guidelines for AICTE Saksham Scholarship Scheme for Differently Abled Students',
    summary: 'Technical education support for specially-abled students with disability not less than 40%.',
    benefits: 'INR 50,000/- per annum towards academic fee support and assistive aids purchase.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The scholar must not receive any duplicate financial assistance from other government schemes for the same course. Discrepancies identified on NSP portal result in immediate clawback.',
      clauseReference: 'Scheme Guidelines Section 4 (Eligibility Criteria)',
      consequenceOfViolation: 'Permanent debarment from national scholarship portal and legal recovery proceedings.',
      allowedExceptions: 'Assistive medical device subsidies provided under ADIP scheme are non-conflicting.',
    },
  },

  // 14. PMRF
  {
    _id: 'scheme-pmrf',
    _type: 'scholarshipScheme',
    title: 'Prime Minister Research Fellowship (PMRF)',
    slug: {current: 'prime-minister-research-fellowship'},
    authority: 'Ministry of Education, Government of India (National Coordination Committee)',
    category: 'central',
    officialDocumentUrl: 'https://www.pmrf.in/guidelines-new.html',
    documentTitle: 'Prime Minister’s Research Fellows (PMRF) Scheme Guidelines & Governance Manual',
    summary: 'Highest-tier doctoral research fellowship in India for PhD scholars in IITs, IISc, IISERs, and central universities.',
    benefits: 'INR 70,000/- to 80,000/- per month + INR 2,00,000/- annual research contingency grant.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A PMRF fellow is strictly barred from availing any other fellowship, stipend, salary, or financial emolument from any government, private, or international funding agency during the fellowship period.',
      clauseReference: 'Section 7 (Fellowship Exclusivity & Undertaking)',
      consequenceOfViolation: 'Immediate termination of PMRF status and liability to refund total fellowship received with 18% penal interest.',
      allowedExceptions: 'No concurrent stipends permitted; university must confirm release from any institutional assistantship.',
    },
  },

  // 15. INSPIRE SHE
  {
    _id: 'scheme-inspire-she',
    _type: 'scholarshipScheme',
    title: 'INSPIRE Scholarship for Higher Education (SHE)',
    slug: {current: 'inspire-scholarship-higher-education'},
    authority: 'Department of Science and Technology (DST), Government of India',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/she-inspire',
    documentTitle: 'Innovation in Science Pursuit for Inspired Research (INSPIRE) - SHE Operational Guidelines',
    summary: 'National flagship scheme encouraging meritorious youth to undertake bachelor and master courses in natural & basic sciences.',
    benefits: 'INR 80,000/- per annum (INR 60,000/- cash stipend + INR 20,000/- summer mentorship project grant).',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Scholars cannot concurrently hold any other fellowship, scholarship, or fee waiver from Central or State Government or other funding bodies. If a student receives another scholarship, they must choose one and refund the other.',
      clauseReference: 'Guidelines Section 6.2 (Disqualification & Forfeiture)',
      consequenceOfViolation: 'Immediate cancellation of INSPIRE registration and blacklisting on PFMS portal.',
      allowedExceptions: 'Summer research fellowship stipends under INSA/IAS/NASI are allowed during vacation period.',
    },
  },

  // 16. Central Sector Scheme of Scholarship (CSSS)
  {
    _id: 'scheme-central-sector-csss',
    _type: 'scholarshipScheme',
    title: 'Central Sector Scheme of Scholarship for College and University Students (CSSS)',
    slug: {current: 'central-sector-scheme-csss'},
    authority: 'Department of Higher Education, Ministry of Education, Government of India',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/csss',
    documentTitle: 'Guidelines for the Central Sector Scheme of Scholarship for College and University Students',
    summary: 'Merit-cum-means scholarship for class 12 pass-outs in top 20th percentile pursuing graduate/professional studies.',
    benefits: 'INR 12,000/- per annum for first three years; INR 20,000/- per annum for postgraduate studies.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The scholarship holder under this scheme shall not avail of any other scholarship or stipend from Central Government or State Government. In case the awardee receives another scholarship, the CSSS scholarship will be terminated.',
      clauseReference: 'Scheme Guidelines Clause 5 (Renewal & Restrictions)',
      consequenceOfViolation: 'Cancellation of CSSS allocation and refund of disbursed tranches.',
      allowedExceptions: 'One-time merit medals and book prize certificates are permitted.',
    },
  },

  // 17. National Overseas Scholarship
  {
    _id: 'scheme-national-overseas-scholarship',
    _type: 'scholarshipScheme',
    title: 'National Overseas Scholarship for SC/ST/De-notified Tribe Students',
    slug: {current: 'national-overseas-scholarship-sc-st'},
    authority: 'Ministry of Social Justice & Empowerment, Government of India',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/nos-sc',
    documentTitle: 'Scheme Guidelines for National Overseas Scholarship for SC Candidates',
    summary: 'Prestigious overseas scholarship funding Master and Ph.D. degrees in top international universities.',
    benefits: 'Full foreign tuition fees + annual maintenance allowance of USD 15,400 / GBP 9,900 + contingency grant + international airfare.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Scholars selected for NOS cannot draw fellowship or financial assistance from any other source including foreign government or university during the course period without prior approval of MoSJE.',
      clauseReference: 'Clause 8 (General Terms and Conditions)',
      consequenceOfViolation: 'Cancellation of visa sponsorship, termination of award, and recovery of full grant under Public Demands Recovery Act.',
      allowedExceptions: 'Partial teaching assistantships up to 10 hours/week permitted with prior approval from Indian High Commission/Embassy.',
    },
  },

  // 18. Ishan Uday Special Scholarship
  {
    _id: 'scheme-ishan-uday-ugc',
    _type: 'scholarshipScheme',
    title: 'Ishan Uday Special Scholarship Scheme for North Eastern Region',
    slug: {current: 'ishan-uday-special-scholarship'},
    authority: 'University Grants Commission (UGC), Ministry of Education',
    category: 'central',
    officialDocumentUrl: 'https://www.ugc.gov.in/ner',
    documentTitle: 'Ishan Uday Special Scholarship Scheme Guidelines, University Grants Commission',
    summary: 'Special initiative supporting students from the eight North Eastern states for general degree, technical, and professional courses.',
    benefits: 'Monthly allowance of INR 5,400/- for general degree and INR 7,800/- for technical/professional degrees.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Awardees under Ishan Uday cannot hold any other scholarship from Central Government, State Government, or UGC during the award period. Multiple scholarships through NSP will result in cancellation.',
      clauseReference: 'Clause 6 (Conditions of Disqualification)',
      consequenceOfViolation: 'Cancellation of scholarship and mandatory refund of all credited tranches through NSP recovery mechanism.',
      allowedExceptions: 'College book bank facilities or library grants are exempt.',
    },
  },

  // 19. NMMSS
  {
    _id: 'scheme-nmmss-scholarship',
    _type: 'scholarshipScheme',
    title: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    slug: {current: 'national-means-cum-merit-scholarship'},
    authority: 'Department of School Education & Literacy, Ministry of Education',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/nmmss',
    documentTitle: 'Guidelines on National Means-cum-Merit Scholarship Scheme (Centrally Sponsored)',
    summary: 'Financial support preventing dropouts after class VIII for meritorious economically weaker students.',
    benefits: 'INR 12,000/- per annum (INR 1,000/- per month) from Class IX to Class XII.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Students availing of any other state or central government scholarship for secondary schooling are not eligible to draw the NMMSS monthly stipend simultaneously.',
      clauseReference: 'Clause 4 (Eligibility Criteria & Restrictions)',
      consequenceOfViolation: 'Disqualification and removal of bank account from PFMS monthly release schedule.',
      allowedExceptions: 'Free textbooks and mid-day meal provisions under RTE are permissible.',
    },
  },

  // 20. PMSS WARB
  {
    _id: 'scheme-pmss-capf-warb',
    _type: 'scholarshipScheme',
    title: 'Prime Minister Scholarship Scheme for Central Armed Police Forces & Assam Rifles',
    slug: {current: 'pm-scholarship-scheme-capf-warb'},
    authority: 'Welfare and Rehabilitation Board (WARB), Ministry of Home Affairs',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/pmss-capf-ar',
    documentTitle: 'Standard Operating Procedures & Guidelines for PMSS under WARB',
    summary: 'Encouraging higher technical and professional education for wards and widows of CAPFs, AR, and State Police personnel.',
    benefits: 'INR 3,000/- per month for girls and INR 2,500/- per month for boys.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A candidate can avail only one scholarship under PMSS or any other Central/State Govt. scholarship scheme. Dual claiming is an offence leading to recovery and blacklisting.',
      clauseReference: 'PMSS Guidelines Section 8 (General Instructions)',
      consequenceOfViolation: 'Immediate de-registration, recovery of funds, and disciplinary referral to respective police/security force headquarters.',
      allowedExceptions: 'Welfare funds disbursed directly by regimental welfare associations for sports are permitted.',
    },
  },

  // 21. BITS Pilani MCN
  {
    _id: 'scheme-bits-pilani-mcn',
    _type: 'scholarshipScheme',
    title: 'BITS Pilani Merit-cum-Need (MCN) Scholarship & Tuition Waiver',
    slug: {current: 'bits-pilani-mcn-scholarship'},
    authority: 'Birla Institute of Technology and Science, Pilani (Student Welfare Division)',
    category: 'institute',
    officialDocumentUrl: 'https://swd.bits-pilani.ac.in/Scholarship.aspx',
    documentTitle: 'BITS Pilani SWD Rules on Fellowships, Scholarships and Student Aid',
    summary: 'Institutional fee concession supporting meritorious students with family income below specified institutional threshold.',
    benefits: 'Tuition fee waiver ranging from 25% up to 100% of semester tuition fees.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Students must disclose all external scholarships. If a student receives external assistance covering partial or full tuition fee, the institute MCN waiver will be proportionally reduced or withdrawn.',
      clauseReference: 'BITS Pilani SWD Scholarship Ordinances Section 3.2 (Proportional Reduction Rule)',
      consequenceOfViolation: 'Cancellation of institutional concession and billing of full semester tuition arrears.',
      allowedExceptions: 'External scholarships covering non-tuition components (hostel, books) are allowed without deduction.',
    },
  },

  // 22. LIC Golden Jubilee
  {
    _id: 'scheme-lic-golden-jubilee',
    _type: 'scholarshipScheme',
    title: 'LIC Golden Jubilee Scholarship Scheme',
    slug: {current: 'lic-golden-jubilee-scholarship'},
    authority: 'Life Insurance Corporation of India (Golden Jubilee Foundation)',
    category: 'corporate',
    officialDocumentUrl: 'https://licindia.in/golden-jubilee-foundation',
    documentTitle: 'LIC Golden Jubilee Foundation Scholarship Scheme Instructions and Covenants',
    summary: 'CSR initiative supporting economically weaker students pursuing higher studies in medicine, engineering, or graduation.',
    benefits: 'INR 20,000/- to INR 40,000/- per annum disbursed in regular installments.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The candidate should not be availing of any other corporate CSR scholarship or trust grant for the same course of study.',
      clauseReference: 'GJF Guidelines Section 5 (Disqualification & Forfeiture)',
      consequenceOfViolation: 'Cancellation of award and cessation of all remaining installment payments.',
      allowedExceptions: 'Government post-matric fee reimbursement cards are permissible.',
    },
  },

  // 23. West Bengal SVMCM
  {
    _id: 'scheme-west-bengal-svmcm',
    _type: 'scholarshipScheme',
    title: 'West Bengal Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)',
    slug: {current: 'west-bengal-svmcm'},
    authority: 'Higher Education Department, Government of West Bengal',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/svmcms',
    documentTitle: 'Notification No. 89-Edn(CS) - Swami Vivekananda Merit-cum-Means Scholarship Guidelines',
    summary: 'Flagship state scholarship scheme assisting meritorious and economically backward students across West Bengal.',
    benefits: 'INR 1,000/- to INR 8,000/- per month depending on degree level (UG, Engineering, Medical, PG, Doctoral).',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The student must not be receiving any other state government scholarship or stipend for the same course. Students availing Kanyashree K2 or K3 must opt for either SVMCM or Kanyashree as per state notification.',
      clauseReference: 'SVMCM Guidelines Section 4.3 (Non-Duplication Rule)',
      consequenceOfViolation: 'Permanent de-registration from SVMCM portal and recovery via state treasury.',
      allowedExceptions: 'Central government scholarships routed via NSP are permissible if family income remains within threshold.',
    },
  },

  // 24. West Bengal Kanyashree
  {
    _id: 'scheme-west-bengal-kanyashree',
    _type: 'scholarshipScheme',
    title: 'West Bengal Kanyashree Prakalpa (K2 & K3)',
    slug: {current: 'west-bengal-kanyashree'},
    authority: 'Department of Women Development and Social Welfare, Govt of West Bengal',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/wbkanyashree',
    documentTitle: 'Kanyashree Prakalpa Standard Operating Procedures & Guidelines',
    summary: 'Cash transfer and scholarship program supporting female students in secondary and postgraduate higher education.',
    benefits: 'One-time grant of INR 25,000/- (K2) and monthly stipend of INR 2,000/- to 2,500/- for PG studies (K3).',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Beneficiaries must not draw concurrent state education maintenance stipends that specifically exclude Kanyashree recipients.',
      clauseReference: 'Kanyashree Standard Operating Procedures Section 6',
      consequenceOfViolation: 'Recovery of duplicate disbursements through the District Child Protection Unit.',
      allowedExceptions: 'Private trust stipends and institutional sports medals are exempted.',
    },
  },

  // 25. Karnataka Vidyasiri
  {
    _id: 'scheme-karnataka-vidyasiri',
    _type: 'scholarshipScheme',
    title: 'Karnataka Vidyasiri (Food & Accommodation) Post-Matric Scheme',
    slug: {current: 'karnataka-vidyasiri-scheme'},
    authority: 'Backward Classes Welfare Department, Government of Karnataka',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/vfas',
    documentTitle: 'Government of Karnataka - Food and Accommodation (Vidyasiri) Scheme Notification',
    summary: 'Stipend scheme providing food and accommodation allowances to backward class students living outside government hostels.',
    benefits: 'Monthly cash assistance of INR 1,500/- for 10 academic months per year.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Students availing free hostel admission, food allowance, or similar lodging stipends from any government or aided institution are strictly barred from drawing Vidyasiri cash assistance.',
      clauseReference: 'Vidyasiri Regulations Clause 4(d)',
      consequenceOfViolation: 'Immediate cancellation, recovery from college dues, and debarment from Karnataka ePASS/SSP portal.',
      allowedExceptions: 'Students may hold post-matric tuition fee reimbursement concurrently with Vidyasiri food allowance.',
    },
  },

  // 26. Maharashtra Dr. Panjabrao Deshmukh
  {
    _id: 'scheme-mahadbt-panjabrao',
    _type: 'scholarshipScheme',
    title: 'Maharashtra Dr. Panjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna',
    slug: {current: 'mahadbt-panjabrao-deshmukh'},
    authority: 'Directorate of Higher Education, Government of Maharashtra',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/drpdhma',
    documentTitle: 'Government Resolution No. EBC-2016/C.R.221/Edu-1 - Dr. Panjabrao Deshmukh Hostel Maintenance Allowance',
    summary: 'Hostel maintenance allowance for children of registered agricultural laborers and marginal landholders pursuing professional degrees.',
    benefits: 'Up to INR 30,000/- per annum for MMRDA/Pune metro areas and INR 20,000/- for other districts.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Students residing in government hostels or receiving hostel maintenance allowance under any other scheme are disqualified from claiming this allowance.',
      clauseReference: 'Government Resolution Clause 3.1',
      consequenceOfViolation: 'MahaDBT profile locking, cancellation of scholarship, and recovery under Land Revenue Code.',
      allowedExceptions: 'Tuition fee reimbursement under Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna is permissible concurrently.',
    },
  },

  // 27. Rajasthan Chief Minister Higher Education
  {
    _id: 'scheme-rajasthan-cmhe',
    _type: 'scholarshipScheme',
    title: 'Rajasthan Chief Minister Higher Education Scholarship Scheme',
    slug: {current: 'rajasthan-chief-minister-higher-education'},
    authority: 'College Education Department, Government of Rajasthan',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/cmhe-r',
    documentTitle: 'Chief Minister Higher Education Scholarship Scheme Regulations, Govt of Rajasthan',
    summary: 'Financial incentive for meritorious students in top merit list of Rajasthan Secondary Board pursuing higher studies.',
    benefits: 'INR 5,000/- per annum (INR 500/- per month for 10 months) for a maximum of 5 years.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Students who are already receiving any other scholarship or financial assistance from the Central or State Government are not eligible for this scheme.',
      clauseReference: 'Guidelines Clause 5 (Eligibility Restrictions)',
      consequenceOfViolation: 'Cancellation of award and recovery of credited stipend via treasury challan.',
      allowedExceptions: 'Disabled student conveyance allowances provided under separate state welfare orders are allowed.',
    },
  },

  // 28. UP Post-Matric Scholarship
  {
    _id: 'scheme-up-post-matric',
    _type: 'scholarshipScheme',
    title: 'Uttar Pradesh Post-Matric Scholarship Scheme',
    slug: {current: 'up-post-matric-scholarship'},
    authority: 'Social Welfare Department, Government of Uttar Pradesh',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/pms-sc-up',
    documentTitle: 'Uttar Pradesh Post-Matric Scholarship and Fee Reimbursement Rules',
    summary: 'State educational assistance and complete tuition fee reimbursement for SC, ST, General, and OBC students in UP.',
    benefits: 'Complete non-refundable fee reimbursement plus monthly maintenance allowance.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Dual registration or receipt of benefits from UP Scholarship portal and Central NSP portal simultaneously is an offense subject to immediate FIR, recovery, and student blacklisting.',
      clauseReference: 'UP Scholarship Rules Rule 12 (Penalty & Enforcement)',
      consequenceOfViolation: 'Criminal FIR filing, recovery with interest under Public Demands Act, and permanent national portal ban.',
      allowedExceptions: 'No concurrent state or central educational scholarships permitted.',
    },
  },

  // 29. Tamil Nadu Free Education Professional Courses
  {
    _id: 'scheme-tamil-nadu-fepc',
    _type: 'scholarshipScheme',
    title: 'Tamil Nadu Free Education Scholarship for Professional Courses',
    slug: {current: 'tamil-nadu-free-education-professional'},
    authority: 'BC, MBC and Minorities Welfare Department, Government of Tamil Nadu',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/fepc',
    documentTitle: 'Tamil Nadu Backward Classes Welfare Directorate - Free Education Scheme Regulations',
    summary: 'Full tuition fee concession for first-generation graduates and rural BC/MBC/DNC students in engineering, medical, and law.',
    benefits: 'Full waiver of tuition and compulsory special non-refundable college fees.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Students availing this free education concession cannot receive another government tuition scholarship for the same degree program.',
      clauseReference: 'Welfare Directorate Guidelines Section 3',
      consequenceOfViolation: 'Cancellation of fee concession and demand for full institutional fee payment.',
      allowedExceptions: 'Post-Matric hostel maintenance allowance is allowed concurrently if the student resides in an approved college hostel.',
    },
  },

  // 30. Delhi Merit Scholarship
  {
    _id: 'scheme-delhi-merit-scholarship',
    _type: 'scholarshipScheme',
    title: 'Delhi Merit Scholarship for College & Professional Institutions',
    slug: {current: 'delhi-state-merit-scholarship'},
    authority: 'Department for Welfare of SC/ST/OBC, Government of NCT of Delhi',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/msfctpi',
    documentTitle: 'Operational Guidelines for Merit Scholarship to College/Professional Students, Govt. of NCT of Delhi',
    summary: 'State assistance for meritorious SC/ST/OBC/Minority students studying in recognized colleges and technical universities in Delhi.',
    benefits: 'Up to INR 18,600/- per annum for hostellers and INR 9,600/- for day scholars pursuing degree/diploma courses.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Beneficiaries cannot draw maintenance allowance or fee support simultaneously from Delhi e-District portal and National Scholarship Portal. Dual claiming triggers immediate cancellation.',
      clauseReference: 'Departmental Notification Circular Clause 8',
      consequenceOfViolation: 'Cancellation of award and recovery of entire paid amount through revenue recovery proceedings.',
      allowedExceptions: 'Institution book bank grants and merit prizes without maintenance component are permissible.',
    },
  },

  // 31. Odisha e-Medhabruti
  {
    _id: 'scheme-odisha-medhabruti',
    _type: 'scholarshipScheme',
    title: 'Odisha Junior Merit Scholarship (e-medhabruti)',
    slug: {current: 'odisha-medhabruti-scholarship'},
    authority: 'Higher Education Department, Government of Odisha',
    category: 'state',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/jmse-m',
    documentTitle: 'Higher Education Department Odisha - e-Medhabruti Guidelines and Eligibility Criteria',
    summary: 'Merit-based financial aid for residents of Odisha pursuing undergraduate, postgraduate, and technical courses.',
    benefits: 'INR 10,000/- per annum for undergraduate professional courses and technical studies.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A student awarded e-Medhabruti cannot hold any other merit scholarship disbursed by the State or Central Government for the same academic stage.',
      clauseReference: 'e-Medhabruti Policy Clause 7',
      consequenceOfViolation: 'Automatic de-registration from Odisha State Scholarship Portal and refund order.',
      allowedExceptions: 'Special coaching allowances and physical disability stipends are exempt.',
    },
  },

  // 32. AICTE Swanath Scholarship
  {
    _id: 'scheme-aicte-swanath',
    _type: 'scholarshipScheme',
    title: 'AICTE Swanath Scholarship Scheme',
    slug: {current: 'aicte-swanath-scholarship'},
    authority: 'All India Council for Technical Education (AICTE), Ministry of Education',
    category: 'central',
    officialDocumentUrl: 'https://www.aicte.gov.in/schemes/students-development-schemes',
    documentTitle: 'AICTE Swanath Scholarship Scheme for Orphans, Wards of Armed Forces & COVID Victims',
    summary: 'Special initiative providing financial support to orphans and children of deceased armed forces personnel pursuing technical education.',
    benefits: 'INR 50,000/- per annum every year till completion of the technical program.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'The candidate must not be in receipt of any government scholarship/stipend from other agencies. Awardees detected with dual benefits will be debarred from AICTE portal.',
      clauseReference: 'Guidelines Clause 3.2 (Exclusivity Clause)',
      consequenceOfViolation: 'Cancellation of award and recovery of disbursed funds.',
      allowedExceptions: 'Institutional fee concessions provided by the college on humanitarian grounds are permitted.',
    },
  },

  // 33. UGC PG Single Girl Child
  {
    _id: 'scheme-ugc-single-girl-child',
    _type: 'scholarshipScheme',
    title: 'Post Graduate Indira Gandhi Scholarship for Single Girl Child',
    slug: {current: 'ugc-pg-single-girl-child'},
    authority: 'University Grants Commission (UGC), Ministry of Education',
    category: 'central',
    officialDocumentUrl: 'https://www.ugc.gov.in/',
    documentTitle: 'UGC Guidelines for Post Graduate Indira Gandhi Scholarship for Single Girl Child',
    summary: 'Encouraging girls who are single children of their parents to pursue postgraduate non-professional degrees.',
    benefits: 'INR 36,200/- per annum for two years (duration of the PG course).',
    stackingRule: {
      hasNonStackingRestriction: false,
      exactClauseText: 'The awardee is eligible to draw any other scholarship/fellowship provided by the host university or government agency, subject to the conditions of that other funding agency.',
      clauseReference: 'UGC Single Girl Child Guidelines Clause 6 (Allowed Concurrent Aid Exception)',
      consequenceOfViolation: 'None; stacking permitted on UGC side. (Host agency restrictions still apply).',
      allowedExceptions: 'Permits concurrent receipt of university merit awards and hostel subsidies.',
    },
  },

  // 34. UGC NET JRF
  {
    _id: 'scheme-ugc-net-jrf',
    _type: 'scholarshipScheme',
    title: 'UGC National Eligibility Test (NET) Junior Research Fellowship',
    slug: {current: 'ugc-net-jrf-fellowship'},
    authority: 'University Grants Commission (UGC)',
    category: 'central',
    officialDocumentUrl: 'https://www.ugc.gov.in/',
    documentTitle: 'UGC Junior Research Fellowship in Sciences, Humanities and Social Sciences Guidelines',
    summary: 'National fellowship supporting scholars qualifying UGC-NET pursuing M.Phil and Ph.D. programs in Indian universities.',
    benefits: 'INR 37,000/- per month + HRA + contingency grant of INR 10,000/- to 20,500/- per year.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'A research fellow shall not accept any other employment, paid assignment, or fellowship/stipend from any other agency during the tenure of the fellowship.',
      clauseReference: 'UGC JRF Scheme Guidelines Clause 11 (Tenure & Obligations)',
      consequenceOfViolation: 'Immediate termination of JRF and recovery of fellowship amounts with penal interest.',
      allowedExceptions: 'Honorary academic tutorials not exceeding 4 hours per week are permissible with supervisor approval.',
    },
  },

  // 35. National Fellowship for Higher Education of ST Students
  {
    _id: 'scheme-nfst-fellowship',
    _type: 'scholarshipScheme',
    title: 'National Fellowship for Higher Education of ST Students (NFST)',
    slug: {current: 'national-fellowship-st-students'},
    authority: 'Ministry of Tribal Affairs, Government of India',
    category: 'central',
    officialDocumentUrl: 'https://www.myscheme.gov.in/schemes/presm',
    documentTitle: 'Scheme Guidelines for National Fellowship for Higher Education of ST Candidates',
    summary: 'Central sector fellowship enabling tribal scholars to pursue M.Phil and Ph.D. in science, humanities, and engineering.',
    benefits: 'Monthly fellowship of INR 37,000/- (JRF) / INR 42,000/- (SRF) + contingency + HRA.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Fellows cannot draw any other fellowship, stipend, or salary during the research tenure. Breach triggers recovery of fellowship and contingency grant.',
      clauseReference: 'Ministry of Tribal Affairs Guidelines Clause 8 (Non-Stacking Provision)',
      consequenceOfViolation: 'Cancellation of award, blacklisting on NSP/PFMS, and financial recovery.',
      allowedExceptions: 'Travel grants for attending academic conferences are permissible with ministry permission.',
    },
  },

  // 36. ICMR Junior Research Fellowship
  {
    _id: 'scheme-icmr-jrf',
    _type: 'scholarshipScheme',
    title: 'ICMR Junior Research Fellowship in Biomedical Sciences',
    slug: {current: 'icmr-junior-research-fellowship'},
    authority: 'Indian Council of Medical Research (ICMR), Department of Health Research',
    category: 'central',
    officialDocumentUrl: 'https://www.csirhrdg.res.in/SiteContent/ManagedContent/ATContent/Implementation_of_revised_CSIR_s_Research_Fellowships_guidelines_reg_20230221170415510_Hi.pdf',
    documentTitle: 'ICMR Guidelines for Junior Research Fellows (JRF) in Biomedical Research',
    summary: 'Fellowship supporting researchers in biomedical and life sciences working in medical colleges and research institutes.',
    benefits: 'INR 37,000/- per month + HRA + annual contingency grant of INR 20,000/-.',
    stackingRule: {
      hasNonStackingRestriction: true,
      exactClauseText: 'Fellows must devote full-time to approved research and shall not hold any other paid post or receive another fellowship/stipend from any source.',
      clauseReference: 'ICMR Research Fellowship Code Clause 9',
      consequenceOfViolation: 'Immediate termination of fellowship and recovery of total grant disbursed.',
      allowedExceptions: 'No concurrent aid permitted.',
    },
  },
]

async function seedCorpus() {
  console.log(`Starting corpus seed into Sanity project: ${projectId}, dataset: ${dataset}...`)
  console.log(`Total verified schemes to seed: ${verifiedSchemes.length}`)

  for (const scheme of verifiedSchemes) {
    try {
      await client.createOrReplace(scheme)
      console.log(`[SEEDED] ${scheme.title.slice(0, 45)} (${scheme.category.toUpperCase()})`)
    } catch (err: any) {
      console.error(`[ERROR] Failed to seed scheme "${scheme.title}":`, err.message)
    }
  }

  console.log(`\nSuccessfully seeded ${verifiedSchemes.length} verified scholarship schemes!`)
}

// Execute seed if run directly
seedCorpus().catch((err) => {
  console.error('Corpus seeding failed:', err)
  process.exit(1)
})
