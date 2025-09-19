import { Styled } from "./styled";

const PrReviews = () => {
    return (
        <Styled.Page>
            <Styled.Title>PR Reviews (Pull Request Reviews)</Styled.Title>

            <Styled.Lead>
                A <b>Pull Request (PR)</b> is a proposal to merge a set of changes from one branch to another.
                A <b>PR Review</b> is the quality gate where teammates read code, run checks, and approve or request changes.
                Done well, reviews improve code quality, knowledge sharing, and team velocity.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Branch:</b> a line of development in Git (e.g., <Styled.InlineCode>feature/auth</Styled.InlineCode>).</li>
                    <li><b>Commit:</b> a saved snapshot of changes with a message describing <em>why</em>.</li>
                    <li><b>Pull Request (PR):</b> a request to merge changes (source branch → target branch).</li>
                    <li><b>Reviewer:</b> person who reads the PR and gives feedback/approval.</li>
                    <li><b>Approval:</b> a signal the change is good to merge (may be "Approve" in GitHub/GitLab).</li>
                    <li><b>Request changes:</b> reviewer blocks merging until issues are addressed.</li>
                    <li><b>CI (Continuous Integration):</b> automated checks (build, tests, lint) that run on each PR.</li>
                    <li><b>Blocking comment:</b> must be addressed before merge (bug, broken test, security risk).</li>
                    <li><b>Non-blocking ("nit"):</b> nice-to-have suggestions that don't prevent merging.</li>
                    <li><b>Merge strategy:</b> how PR is merged (merge commit, squash, rebase). Teams choose one.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) What makes a good PR? */}
            <Styled.Section>
                <Styled.H2>What Makes a Good PR?</Styled.H2>
                <Styled.List>
                    <li><b>Small & focused:</b> one feature/fix per PR; avoid "mega PRs".</li>
                    <li><b>Clear title:</b> concise, imperative: "Add login form validation".</li>
                    <li><b>Descriptive body:</b> problem, approach, screenshots/vids, trade-offs, testing notes.</li>
                    <li><b>Passing CI:</b> PR should build & test cleanly; fix red pipelines first.</li>
                    <li><b>Linked issue:</b> reference ticket/issue ID for traceability.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# Good PR title
Add optimistic cart updates and rollback on API failure

# Good PR description
## Why
Cart felt slow due to server round-trip. Users abandoned edits if network lagged.

## What
- Add optimistic updates for add/remove/change qty
- Rollback state if API fails; show toast with retry
- Unit tests for reducer cases
- Storybook demo

## How to test
1) Update qty quickly; UI should feel instant
2) Simulate API failure; UI rolls back + shows error toast

Resolves: #482`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Reviewer responsibilities */}
            <Styled.Section>
                <Styled.H2>Reviewer Responsibilities</Styled.H2>
                <Styled.List>
                    <li><b>Understand context:</b> read title/body, linked issue, skim key files first.</li>
                    <li><b>Run locally (if needed):</b> follow steps, verify behavior matches description.</li>
                    <li><b>Check correctness:</b> logic, edge cases, error handling, race conditions.</li>
                    <li><b>Check tests:</b> unit/e2e coverage meaningful? CRUD paths covered? failing tests?</li>
                    <li><b>Check quality:</b> readability, naming, duplication, dead code, comments where helpful.</li>
                    <li><b>Check security & privacy:</b> input validation, injection, auth, secrets, PII.</li>
                    <li><b>Check performance:</b> O(n) hot paths, unnecessary re-renders, heavy assets.</li>
                    <li><b>Check accessibility (a11y):</b> keyboard/focus order, semantics, alt text, color contrast.</li>
                    <li><b>Be kind and specific:</b> propose concrete improvements; prefer examples and links.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Author responsibilities */}
            <Styled.Section>
                <Styled.H2>Author Responsibilities</Styled.H2>
                <Styled.List>
                    <li><b>Proof before opening:</b> self-review diff; remove debug logs and unused code.</li>
                    <li><b>Keep scope tight:</b> if a refactor grows large, split into a separate PR.</li>
                    <li><b>Respond promptly:</b> address blocking items first; mark "Resolved" only after fixing.</li>
                    <li><b>Document decisions:</b> explain why, mention trade-offs; link design notes/ADRs if any.</li>
                    <li><b>Tests:</b> include/adjust tests for new behavior; keep flaky tests out of main.</li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Comment styles & examples */}
            <Styled.Section>
                <Styled.H2>Comment Styles & Examples</Styled.H2>
                <Styled.List>
                    <li><b>Nit:</b> minor, non-blocking improvement.</li>
                    <li><b>Suggestion:</b> alternative approach or clearer naming.</li>
                    <li><b>Question:</b> clarify intent or reasoning.</li>
                    <li><b>Blocking:</b> must fix before merge (correctness, security, failing test).</li>
                </Styled.List>
                <Styled.Pre>
                    {`# Nit (non-blocking)
nit: prefer 'maxItems' to match API docs

# Suggestion
suggestion: consider useMemo here; list filters re-calc each keystroke

# Question
question: can we get a test for empty cart state?

# Blocking
blocking: this misses null check; crashes if response.items is undefined`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Checklists (quick, practical) */}
            <Styled.Section>
                <Styled.H2>Quick Checklists</Styled.H2>
                <Styled.H3>Reviewer</Styled.H3>
                <Styled.List>
                    <li>✅ CI green (build, tests, lint, typecheck)</li>
                    <li>✅ Repro steps work as described</li>
                    <li>✅ Edge cases handled; errors surfaced to UI logs/toasts</li>
                    <li>✅ No secret keys, tokens, or PII in code/logs</li>
                    <li>✅ Docs updated (README, Storybook, ADRs) if behavior changed</li>
                </Styled.List>
                <Styled.H3>Author</Styled.H3>
                <Styled.List>
                    <li>✅ Small, focused diff; screenshots/gifs included</li>
                    <li>✅ Meaningful commit messages; squash if noisy</li>
                    <li>✅ Tests added/updated; flaky tests quarantined</li>
                    <li>✅ Feature flags / env guards where needed</li>
                    <li>✅ Rollback plan or clear failure behavior</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Merge strategies & messages */}
            <Styled.Section>
                <Styled.H2>Merge Strategies & Messages</Styled.H2>
                <Styled.List>
                    <li><b>Squash merge (recommended):</b> condenses commits into one; keeps history clean.</li>
                    <li><b>Rebase then merge:</b> linear history but requires careful conflict handling.</li>
                    <li><b>Merge commit:</b> preserves individual commits; can get noisy.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# Clean, conventional commit (squash message)
feat(cart): add optimistic updates with rollback on API failure

- Faster perceived updates
- Rollback + toast on failure
- Tests for reducer and error flow

Refs: #482`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Etiquette & anti-patterns */}
            <Styled.Section>
                <Styled.H2>Etiquette & Anti-patterns</Styled.H2>
                <Styled.List>
                    <li><b>Be respectful:</b> critique the code, not the person.</li>
                    <li><b>Timebox reviews:</b> large PRs reduce quality; ask authors to split.</li>
                    <li><b>Avoid bikeshedding:</b> don't block on subjective style if linters enforce it.</li>
                    <li><b>Don't "approve & forget":</b> ensure blocking feedback is resolved before merging.</li>
                    <li><b>Avoid surprise refactors:</b> move refactors to separate PRs unless tiny.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Security, Privacy, A11y, Perf */}
            <Styled.Section>
                <Styled.H2>Security • Privacy • Accessibility • Performance</Styled.H2>
                <Styled.List>
                    <li><b>Security:</b> validate inputs, sanitize HTML, avoid exposing tokens, principle of least privilege.</li>
                    <li><b>Privacy:</b> don't log PII; follow data-retention policies; mask sensitive fields.</li>
                    <li><b>Accessibility:</b> semantic HTML, labels, keyboard navigation, focus management, color contrast.</li>
                    <li><b>Performance:</b> lazy load heavy chunks, memoize hot paths, compress images, avoid N+1 fetches.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) ADRs and follow-ups */}
            <Styled.Section>
                <Styled.H2>ADRs & Follow-ups</Styled.H2>
                <Styled.List>
                    <li><b>ADR (Architecture Decision Record):</b> a short doc capturing a key decision, context, options, and consequences.</li>
                    <li>Link ADRs from PRs when you choose a non-obvious approach or long-term trade-off.</li>
                    <li>Create follow-up issues for deferred items; don't block this PR on unrelated refactors.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>LGTM:</b> "Looks Good To Me" — an informal approval.</li>
                    <li><b>Nit:</b> a small, non-blocking suggestion.</li>
                    <li><b>Blocking:</b> stops merge until fixed.</li>
                    <li><b>CLA/DCO:</b> Contributor License Agreement / Developer Certificate of Origin (legal compliance for contributions).</li>
                    <li><b>Flaky test:</b> sometimes passes, sometimes fails without code changes.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Keep PRs small, describe the why and how, pass CI, be kind and specific in reviews,
                and prioritize correctness, safety, accessibility, and performance. Favor squash merges with
                clean messages and create follow-ups for non-critical refactors.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default PrReviews;
