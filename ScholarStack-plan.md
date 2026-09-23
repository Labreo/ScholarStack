# Scholarship Stacking Trap — Project Plan

Sanity Challenge, Path One ("Ship an Agent That Queries Real Content")
Deadline: October 4, 2026
Challenge page: https://dev.to/challenges/sanity-2026-09-16

## 1. The one problem this solves

**A student who already has one scholarship asks: "Can I also accept this other one?" Generic search and ChatGPT say yes. The real answer, buried in a non-stacking clause in the second scheme's own rulebook, is no — and accepting it triggers disqualification, clawback, or a blacklist.**

That is the entire product. Not a scholarship search engine. Not an eligibility checker. Not a database of every scheme in India. One question, answered correctly, with the source shown, when every obvious way of asking it gets you the wrong answer.

If you find yourself wanting to add "and it can also tell you which scholarships you qualify for" or "and it tracks deadlines" — that's scope creep. Cut it. The judges are told explicitly: they want depth on one hard, structured problem, not breadth across many easy ones.

## 2. Why the underlying problem is real (not invented for the demo)

Non-stacking clauses are a genuine, recurring pattern across Indian scholarships — state, central, institute, and corporate — not a hypothetical edge case. Verified examples, each from the scheme's own document:

- **Central pre-matric scheme** (myscheme.gov.in): a holder "will not hold any other educational scholarship... If awarded any other... the student can avail of either of the two... as per his/her choice."
  https://www.myscheme.gov.in/hi/schemes/pmyasasvipmsobcebcdnts
- **Central post-matric SC/ST/OBC scheme** (myscheme.gov.in): "must not be availing any other scholarship by the govt," with recovery of the amount if found in violation.
  https://www.myscheme.gov.in/hi/schemes/presm
- **Goa state scheme** (Directorate of Social Welfare): "A scholarship holder under this scheme shall not avail any other scholarship/stipend for pursuing the same course."
  https://socialwelfare.goa.gov.in/wp-content/uploads/2025/04/Scheme-of-Scholarship-to-students-pursuing-home-nursing-Courses.pdf
- **IIT Guwahati institute scholarship ordinance**: holder "shall not ordinarily receive any other scholarship, stipend, financial assistance... except with the prior permission of the competent authority."
  https://www.iitg.ac.in/fresherportal/ScholarshipOrdinance.pdf
- **Samsung "Star Scholar" program** (a real corporate CSR scholarship — good stand-in for "Scheme B" in the concept): "shall not avail any other financial assistance or scholarship from any Institute, Government or Non-Government source."
  https://images.samsung.com/is/content/samsung/assets/in/microsite/sapne-hue-bade/stories/StarScholarRuleBook.pdf
- **FTII scholarship rules**: no more than one scholarship/assistantship/freeship "except for scholarships sponsored by Centre, State," with a formal written-choice procedure if a second one comes through.
  https://ftii.ac.in/api/serve/2026/06/19/03._Scholarship_-_Rules_and_Regulation_1.pdf
- **A real student already got burned by this**, on a public forum: told outright that state fee reimbursement and an NSP-routed national scholarship cannot both be held.
  https://www.careers360.com/question-i-have-got-full-fee-reimbursementin-in-ts-eamcet-and-secured-a-seat-in-vnr-vignana-jyothi-institute-of-engineering-technology-if-i-apply-for-national-scholarship-will-my-fee-reimbursementin-get-canceled-or-will-i-get-the-national-scholarship/amp

This gives a real dataset to build from, not invented rules. Cross-checking these against the actual NSP process is also worth doing: https://scholarships.gov.in/

## 3. Why this idea, scoped this way, fits the judging criteria

Path One judging criteria: meaningful use of Sanity Context and structured content, technical implementation and code quality, use of Knowledge Bases, usability.

- **Meaningful use of structured content**: the contradiction is not a single fact you could paraphrase from one page. It only appears when two independently-true documents are cross-referenced (Scheme A says you're eligible, Scheme B says accepting Scheme A voids Scheme B). That's a relationship between records, not a lookup — the exact thing the brief says keyword search cannot do. Quote from the brief: "if a keyword search would have gotten you the same answer, aim higher."
- **Use of Knowledge Bases**: this is a textbook case for reconciling multiple source documents ahead of query time rather than at query time — see Knowledge Bases docs below.
- **Usability**: the agent has to actually give the right answer, live, against real content through Context MCP — not a scripted or hardcoded response. That's what Section 6 below is really about.

## 4. The differentiator (read this before building)

A large share of existing Path One submissions are already "agent flags a contradiction between two official documents, human resolves it in Sanity." Scholarships alone won't stand out — the mechanic is now common across the challenge (mortgage policy, license compatibility, pharma QA, medical device evidence gaps, government contracting, cabin/travel rules, and more all use this exact shape).

What should make this one different is **not** a bigger dataset or more scheme types. It's this:

**The resolution should be a tracked decision, not just a flagged warning.**

Most versions of this pattern stop at "here are two conflicting sources, a human picked one." This version should go one step further: once a student is told they must give up Scheme A to keep Scheme B, that decision becomes a fact the agent remembers and can act on later — e.g. if the same student later asks about a third scheme, the agent already knows Scheme A was surrendered and reasons from the updated state, instead of re-surfacing the same resolved conflict from scratch. That's the "decision carries across future builds" idea the challenge brief itself gestures at, taken seriously instead of left as a one-off flag.

Keep this to one clean instance of the behavior for the demo. Don't build a general-purpose state machine for every possible scholarship interaction — one worked example of "conflict flagged → human resolves → agent remembers the resolution → agent uses it in a later question" is enough to prove the point.

## 5. Content plan — what to actually put in the Knowledge Base

Keep the corpus small and real rather than broad and thin. Suggested scope for the MVP:

- **2–3 scholarship schemes**, chosen so at least one pairing has a genuine, quotable non-stacking clause. A strong pairing: the Goa state scheme (personal relevance, real document) + one central scheme from myscheme.gov.in + optionally the Samsung corporate scholarship as a "Scheme B with a harsher clause" contrast.
- For each scheme, source the **actual PDF or scheme page**, not a summary of it — the challenge asks for a Sanity project ID or public dataset URL specifically so judges can check how the content was modeled and sourced. Fabricated-sounding clauses will not survive that check.
- One clarifying document if you can find it (a circular, FAQ, or errata page distinguishing which benefit types count as "financial assistance" vs. which don't — several real schemes draw exactly this distinction, e.g. transport/hostel allowances vs. tuition waivers). This is optional polish, not required for the MVP.
- Do not try to cover every state or every scheme type. Depth on 2–3 real, correctly-sourced schemes beats breadth across dozens of paraphrased ones.

## 5a. Required setup and credentials — read before writing any code

**Instruction to any LLM or coding agent building from this document: stop before generating configuration, code, or a `.env` file, and ask the user for the exact values below by name. Do not invent, guess, or use placeholder-as-if-real values (no fake project IDs, no fake tokens, no assuming a default org or dataset name) and do not silently create a new Sanity organization or project on the user's behalf. If a value is missing, ask for it and wait — don't scaffold around it as if it were provided.**

This list is what's actually required, based on Sanity's own setup docs (Sanity Context prerequisites, quick start, and Configure an MCP guide):

**Sanity side**
- **Sanity organization ID** — identifies which org's Context app and MCP endpoint you're using.
- **Sanity organization API token, with Context Viewer permission** (Context Editor also works, but Viewer is the least-privilege option and should be preferred). Created under Manage → API → Tokens **at the organization level**, not the project level. This token authorizes the agent to call the MCP endpoint and must stay server-side, never in client code or committed to a repo.
- **Confirmation that Context is enabled for the organization.** This is an org-admin action from the Apps page in Manage, not something the agent can turn on itself — ask the user to confirm this has been done, or do it themselves, before assuming the MCP endpoint will work.
- **Sanity project ID** and **dataset name** (e.g. `production`) — where the scheme documents actually live.
- **Sanity API read token** (project-level) — used separately from the org Context token, for reading/writing content and deploying schema. Some setups also need a write-capable token if content is created via the API rather than by hand in Studio; ask which is intended before assuming write access is needed.
- **A deployed Studio schema on v5.1.0 or later.** Sanity Context reads schema from the deployed Studio, so this has to exist (`sanity schema deploy`, or one visit to the hosted Studio if deployed via `sanity deploy`) before the MCP endpoint will serve anything.
- **MCP endpoint name** — a short, stable identifier (e.g. `stackcheck-agent`) chosen when creating the MCP in the Context app. This is not a secret, but it's a real decision the user should make, not one the agent should invent silently, since it's immutable after creation.
- **MCP endpoint URL** — generated once the MCP is created in the Context app; shown in the Sanity Context document in Studio and in the Dashboard. Don't fabricate a plausible-looking URL — get the real one from the user.

**Model / agent side**
- **Which model provider** the agent itself will use to reason and answer (e.g. Anthropic, OpenAI) — ask, don't default silently, since it changes both the API key needed and the agent framework/SDK.
- **API key for that model provider** (e.g. `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`).

**Environment**
- **Node.js 20.19+ or 22.12+** if the setup uses the Sanity Context skill installer or any `npx`-based tooling — confirm the environment meets this before assuming the guided setup will run.

**Only if deploying the agent somewhere public** (optional for the hackathon, only needed if hosting the demo live rather than running it locally for the video)
- Hosting platform credentials/token (e.g. a Vercel token) and the intended domain or project name on that platform.

None of the above should live anywhere but a local `.env` file (or the hosting platform's secret manager if deployed), and the `.env` file itself should never be committed to the repo shared for judging — a `.gitignore` entry for it is part of "technical implementation and code quality," one of the actual judging criteria.



No demo video is required. What's required is that the thing genuinely works and the article shows that honestly. That's a higher bar than it sounds, because it's easy to end up with something that only works for the one question you tested.

The agent is functionally correct if, unscripted, it can:

1. Take the question "I'm getting [Scheme A]. Can I also accept [Scheme B]?" and answer it by actually querying Context MCP against the real Knowledge Base — not a hardcoded if/else on the exact phrase you tested with. Rephrase the question, ask about the other scheme first, ask about a scheme not in the stacking pair — it should still reason correctly or say it doesn't know, never confidently wrong.
2. Cite the specific clause and source document it's answering from, every time, not just in the one example you polished.
3. Reflect a resolution once one is made in Sanity — the "agent remembers what was decided" behavior from Section 4 — and this has to be a real round trip (Sanity → Context MCP → agent), not something narrated in the article but not actually wired up.
4. Fail honestly on questions outside its actual corpus (a scheme you didn't add), rather than hallucinating an answer. This is worth testing deliberately — it's the easiest thing to skip and the first thing that breaks trust in the article.

Before writing the article, actually run all four checks above, not just the happy path. The article should show real output from a real run, including the clause citation and the source link, not a mocked-up screenshot or a paraphrase of what it's supposed to do.

Keep it to one scheme pairing done correctly (Section 5) rather than several done shakily. A single pairing that survives rephrased questions and honestly says "I don't know" outside its scope is worth more than three pairings where the wiring is fragile.

## 7. Resources

**Challenge**
- Challenge page and full rules: https://dev.to/challenges/sanity-2026-09-16
- Sanity Discord (has a #mcp-server channel): join via the challenge page link above

**Sanity Context / MCP (what the agent reads from)**
- Sanity Context overview and setup: https://www.sanity.io/docs/ai/sanity-context
- Knowledge Bases — what they are and when to use one instead of raw GROQ: https://www.sanity.io/docs/ai/sanity-context-knowledge-bases
- Context retrieval modes (GROQ mode vs. Knowledge Base mode): https://www.sanity.io/docs/ai/sanity-context-retrieval-modes
- Creating a Knowledge Base: https://www.sanity.io/docs/ai/sanity-context-create-knowledge-base
- Context MCP reference (endpoints, config, tools): https://www.sanity.io/docs/ai/sanity-context-mcp
- Content access and security (tokens, permissions, read-only nature of Context MCP): https://www.sanity.io/docs/ai/sanity-context-security
- Sanity MCP server (only relevant if you want the agent to *write* — Context MCP itself is read-only): https://www.sanity.io/docs/ai/mcp-server
- Full Sanity docs index (useful for any agent tooling you use to help build this): https://www.sanity.io/docs/llms.txt

**Scholarship source material (starting corpus — verify and expand as needed)**
- National Scholarship Portal (central hub, official): https://scholarships.gov.in/
- Pre-matric scheme with stacking clause: https://www.myscheme.gov.in/hi/schemes/pmyasasvipmsobcebcdnts
- Post-matric SC/ST/OBC scheme with stacking clause: https://www.myscheme.gov.in/hi/schemes/presm
- Goa state scholarship (Directorate of Social Welfare) PDF: https://socialwelfare.goa.gov.in/wp-content/uploads/2025/04/Scheme-of-Scholarship-to-students-pursuing-home-nursing-Courses.pdf
- IIT Guwahati scholarship ordinance PDF: https://www.iitg.ac.in/fresherportal/ScholarshipOrdinance.pdf
- Samsung Star Scholar rulebook PDF: https://images.samsung.com/is/content/samsung/assets/in/microsite/sapne-hue-bade/stories/StarScholarRuleBook.pdf
- FTII scholarship rules and regulations PDF: https://ftii.ac.in/api/serve/2026/06/19/03._Scholarship_-_Rules_and_Regulation_1.pdf
- Real student forum thread hitting this exact problem: https://www.careers360.com/question-i-have-got-full-fee-reimbursementin-in-ts-eamcet-and-secured-a-seat-in-vnr-vignana-jyothi-institute-of-engineering-technology-if-i-apply-for-national-scholarship-will-my-fee-reimbursementin-get-canceled-or-will-i-get-the-national-scholarship/amp

## 8. Timeline (11 days from today, Sep 23, to Oct 4)

Rough allocation, adjust to your own pace, but keep content sourcing early — it's the part most likely to take longer than expected:

- **Days 1–2**: Source and verify the 2–3 real scheme documents. Confirm the exact non-stacking clauses and pull the precise, quotable language. Set up the Sanity project.
- **Days 3–4**: Get Sanity Context running against the content and confirm the agent can read it through MCP. Build the Knowledge Base.
- **Days 5–7**: Build the agent conversation flow for the core question (Section 1) and the human-resolution step (Section 4). Get the one differentiator behavior working end to end — don't generalize it.
- **Days 8–9**: Run the correctness checks in Section 6 — rephrased questions, out-of-scope questions, the resolution round trip — and fix what breaks. Write the DEV post from real output, not from what it's supposed to do. Get the dataset URL / project ID ready for judges to inspect.
- **Days 10–11**: Buffer. Something in a real government PDF corpus will not parse cleanly, and something in the agent will only work for the exact phrasing you first tried. Budget time for both, not for new features.

## 9. The 3-minute video

Confirmed from the actual submission template (dev.to): the "Demo" field asks for either a video walkthrough or a link to the deployed project — so a video isn't strictly mandatory, but it's the stronger option for Track 1 since judging criteria include "usability," which is easier to prove live than to claim in text.

Structure (3:00 total). Every beat should show something real running, not slides:

- **0:00–0:30 — The real problem.** State it in one sentence with a real stake: a student can lose a scholarship, or owe money back, for accepting a second one they were never warned about. Show one real clause on screen (e.g. the Goa scheme or Samsung Star Scholar text from Section 2) — an actual document, not a mockup, with the source URL visible.
- **0:30–1:00 — Why this can't be solved by search.** Show a plain web search or generic AI answer getting it wrong — confidently saying yes when the real answer is no. This is the "keyword search would have gotten you the same wrong answer" moment the challenge brief is explicitly looking for.
- **1:00–1:45 — What Sanity uniquely does.** Show the Knowledge Base holding both real documents, and the agent's answer citing both sources side by side with the actual contradicting clauses. Say plainly: this only works because the two documents were structured and reconciled ahead of time, not re-read and guessed at on every question — that's Context MCP and the Knowledge Base doing something a generic RAG-over-PDFs setup would not reliably do.
- **1:45–2:30 — The resolution that carries forward.** Show a human making the call in Sanity (which scheme to keep, what to surrender), then show the agent using that resolved decision in a later question, without re-flagging the same conflict. This is the differentiator from Section 4 — it's the single most important thing to get on camera, since it's what separates this from the "flag a contradiction and stop" pattern most other submissions will show.
- **2:30–3:00 — Close.** One sentence on what was structured (2–3 real schemes, verifiable), the Sanity project ID or dataset link on screen, and a one-line recap of the problem solved.

Notes on shooting it:
- Everything shown must be a real, unscripted run against the actual Context MCP endpoint — not a mocked UI or a pre-written transcript pasted in as if it were live output. If a judge can tell it's staged, it undercuts the "technical implementation" and "usability" criteria at once.
- Don't narrate features that aren't in the video. If the follow-up-question behavior in the 1:45–2:30 beat isn't actually working yet by the time you shoot, cut that beat rather than describe it and not show it.
- Keep it to the one scheme pairing from Section 5. Three minutes is not enough time to demo three scheme pairs well; it's enough for one, shown properly.

## 10. Risks and how to handle them

- **Sourcing takes longer than expected.** Real scheme PDFs are inconsistently formatted and scattered across state, central, and institute sites. Mitigation: the 6 sources above are already verified and ready to use as a starting corpus — you don't need to source from zero.
- **Genre saturation.** Many other submissions use the same "flag a contradiction" mechanic. Mitigation: Section 4's tracked-resolution behavior is the thing to actually build and show, not just the flag itself.
- **Scope creep.** The temptation will be to add more schemes, a search UI, deadline tracking, etc. Mitigation: Section 1 is the test — if a feature doesn't serve the one question, it doesn't go in.
- **Judges checking the dataset against sources.** The challenge explicitly asks for a project ID or public dataset URL. Mitigation: use real clause text from the documents above, correctly attributed, not paraphrased-to-the-point-of-inaccuracy.

[Sanity Context](https://www.sanity.io/docs/ai/sanity-context): required reading for the agent path
[Day One with Sanity](https://sanity.io/learn): the guided course, start here if you're new
[Sanity docs](https://sanity.io/docs): schemas, GROQ, Studio
[Workflows](https://www.sanity.io/docs/workflows/cookbook): AI content pipelines, coordinated releases, and more
[Knowledge Bases](https://www.sanity.io/docs/ai/sanity-context-knowledge-bases): getting started with Knowledge Bases
[App SDK](https://www.sanity.io/docs/app-sdk/sdk-introduction): for the bonus path
Framework quickstarts: [Next.js](https://www.sanity.io/docs/next-js-quickstart), [Astro](https://www.sanity.io/docs/astro-quickstart), [Nuxt](https://www.sanity.io/docs/nuxt-js-quickstart), [React Router](https://www.sanity.io/docs/react-router-quickstart)
[Sanity Discord](https://snty.link/community): the Sanity team is in there, including a #mcp-server channel