import React from "react";
import { Styled } from "./styled";

const Adrs = () => {
    return (
        <Styled.Page>
            <Styled.Title>Architecture Decision Records (ADRs)</Styled.Title>

            <Styled.Lead>
                An <b>Architecture Decision Record (ADR)</b> is a short, versioned document that captures a
                <i> single, significant technical decision</i>, its context, options, consequences, and status.
                ADRs help teams remember <em>why</em> something was chosen, not just <em>what</em> was built.
            </Styled.Lead>

            {/* 1) Why ADRs */}
            <Styled.Section>
                <Styled.H2>Why ADRs?</Styled.H2>
                <Styled.List>
                    <li><b>Shared memory:</b> preserves context & trade-offs for current and future teammates.</li>
                    <li><b>Decision hygiene:</b> forces clear problem framing and explicit alternatives.</li>
                    <li><b>Change audit:</b> decisions can be <em>reconsidered</em>, <em>deprecated</em>, or <em>superseded</em> with a trace.</li>
                    <li><b>Lightweight:</b> each ADR is small (1-2 pages), living alongside code in the repo.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (Beginner Friendly)</Styled.H2>
                <Styled.List>
                    <li><b>Context:</b> the background facts/constraints driving the decision (requirements, risks, deadlines).</li>
                    <li><b>Options (Alternatives):</b> feasible paths you considered, not strawmen—each with pros/cons.</li>
                    <li><b>Decision:</b> the chosen option and the reasons it wins <i>now</i>.</li>
                    <li><b>Consequences:</b> follow-on effects of the decision (cost, complexity, lock-in, team workflows).</li>
                    <li><b>Status:</b> lifecycle of the ADR: <Styled.InlineCode>Proposed</Styled.InlineCode>, <Styled.InlineCode>Accepted</Styled.InlineCode>, <Styled.InlineCode>Deprecated</Styled.InlineCode>, <Styled.InlineCode>Superseded</Styled.InlineCode>.</li>
                    <li><b>Superseded by:</b> link to the ADR that replaced this one when direction changed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal structure */}
            <Styled.Section>
                <Styled.H2>Minimal ADR Structure</Styled.H2>
                <Styled.Pre>
                    {`# ADR N: <Short title>
Date: YYYY-MM-DD
Status: Proposed | Accepted | Deprecated | Superseded by ADR M

## Context
What problem are we solving? What constraints matter (time, budget, skills, scale, compliance)?

## Decision
What option did we choose? Why this over others? Summarize the reasoning.

## Alternatives
- Option A — Pros / Cons
- Option B — Pros / Cons
- Option C — Pros / Cons

## Consequences
Positive and negative outcomes. New risks introduced. Cost of reversal. Operational impact.

## References
Links to tickets, docs, benchmarks, PRs, spikes.`}
                </Styled.Pre>
                <Styled.Small>Keep it short. One ADR per decision. Link related ADRs instead of cramming everything into one.</Styled.Small>
            </Styled.Section>

            {/* 4) Example ADR */}
            <Styled.Section>
                <Styled.H2>Example ADR — “Adopt React Query for Server State”</Styled.H2>
                <Styled.Pre>
                    {`# ADR 7: Adopt React Query for Server State
Date: 2025-09-18
Status: Accepted

## Context
We fetch list/detail pages and need caching, retries, pagination, and background refresh.
Existing useEffect + fetch is duplicated and error-prone.

## Decision
Use React Query for all server-state (HTTP) concerns in the SPA.
Reasoning: batteries-included caching, stale-while-revalidate, pagination helpers, devtools.

## Alternatives
- Keep custom hooks (fetch + useEffect)
  + No new dependency
  - Reimplement caching/retries; higher maintenance
- SWR
  + Simple API, good caching
  - Fewer built-in pagination/mutation patterns for our needs

## Consequences
+ Faster iteration; less boilerplate
+ Predictable cache invalidation via keys
- Team must learn query/mutation mental model
- Vendor lock-in risk is acceptable

## References
- Spike PR #142 showing migration on /products
- Perf profile before/after`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Numbering & naming */}
            <Styled.Section>
                <Styled.H2>Numbering, Naming, and Location</Styled.H2>
                <Styled.List>
                    <li><b>Folder:</b> keep ADRs in the repo, e.g., <Styled.InlineCode>/docs/adrs/</Styled.InlineCode>.</li>
                    <li><b>File name:</b> prefix with a sequence and kebab title, e.g., <Styled.InlineCode>0007-adopt-react-query.md</Styled.InlineCode>.</li>
                    <li><b>Index:</b> maintain a simple <Styled.InlineCode>README.md</Styled.InlineCode> (table of ADRs with status/links).</li>
                </Styled.List>
                <Styled.Pre>
                    {`/docs
  /adrs
    0001-choose-monorepo.md
    0002-auth-strategy-jwt-vs-session.md
    0003-ui-library-choice.md
    0007-adopt-react-query.md
  README.md  # index of ADRs`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) When to write an ADR */}
            <Styled.Section>
                <Styled.H2>When to Write an ADR</Styled.H2>
                <Styled.List>
                    <li><b>Irreversible-ish choice:</b> database, auth model, state library, build system.</li>
                    <li><b>Cross-team impact:</b> conventions, CI/CD, folder structure, error handling patterns.</li>
                    <li><b>External dependencies:</b> paid SaaS, SDKs, licenses, hosting providers.</li>
                    <li><b>Security/compliance:</b> data retention, PII handling, audit trails.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Writing tips */}
            <Styled.Section>
                <Styled.H2>Writing Tips (Do / Don't)</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep ADRs concise (1-2 pages). Link out to detail/PRs/benchmarks.</li>
                    <li><b>Do</b> record <em>real alternatives</em> you actually compared, with honest trade-offs.</li>
                    <li><b>Do</b> timestamp and set <Styled.InlineCode>Status</Styled.InlineCode>; update when reality changes.</li>
                    <li><b>Don't</b> write after-the-fact fiction—ADRs are not marketing copy.</li>
                    <li><b>Don't</b> cram multiple big decisions into one ADR—split them and cross-link.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Team workflow */}
            <Styled.Section>
                <Styled.H2>Team Workflow (Lightweight)</Styled.H2>
                <Styled.List>
                    <li>Create ADR as <b>Proposed</b> in a PR. Ask for targeted review (architect, lead, QA/security as needed).</li>
                    <li>Merge as <b>Accepted</b> (or <b>Rejected</b>) with reviewer sign-offs in the PR.</li>
                    <li>If direction changes, open a new ADR and mark the old one <b>Superseded</b> with a link.</li>
                    <li>Reference ADR numbers in commits/PR descriptions to keep the chain of evidence.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Template you can copy */}
            <Styled.Section>
                <Styled.H2>Copy-Paste ADR Template</Styled.H2>
                <Styled.Pre>
                    {`# ADR N: <Short title>
Date: <YYYY-MM-DD>
Status: Proposed

## Context
<Background, constraints, goals, non-goals>

## Decision
<Chosen option and the reasoning>

## Alternatives
- <Option A> — Pros / Cons
- <Option B> — Pros / Cons
- <Option C> — Pros / Cons

## Consequences
<Positive/negative outcomes, risks, migration, ops impact>

## References
<Tickets, PRs, docs, benchmarks>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Tooling (optional) */}
            <Styled.Section>
                <Styled.H2>Tooling (Optional)</Styled.H2>
                <Styled.List>
                    <li><b>adr-tools:</b> small CLI to create/number ADRs with a consistent template.</li>
                    <li><b>Docs site:</b> render ADRs with your existing notes site or Storybook docs tab.</li>
                    <li><b>PR checks:</b> lint for <Styled.InlineCode>/docs/adrs/</Styled.InlineCode> presence when specific labels are used (e.g., “architecture”).</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Decision record:</b> a log entry documenting a technical choice and its rationale.</li>
                    <li><b>Supersede:</b> replace a previous decision with a newer, accepted one.</li>
                    <li><b>Trade-off:</b> a compromise between competing goals (cost vs speed, simplicity vs flexibility).</li>
                    <li><b>Reversible decision:</b> a choice that can be changed cheaply later; often doesn't need an ADR.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: ADRs are your team's collective memory for important technical choices.
                Keep them small, honest, and current—one decision per record, with clear context,
                real alternatives, and explicit consequences.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Adrs;
