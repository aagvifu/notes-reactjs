import React from "react";
import { Styled } from "./styled";

const Conventions = () => {
    return (
        <Styled.Page>
            <Styled.Title>Conventions</Styled.Title>

            <Styled.Lead>
                Conventions are the shared rules your team follows—how you name files, organize folders,
                write commits/PRs, version releases, and document changes. Good conventions reduce confusion,
                make reviews faster, and keep the codebase predictable for everyone.
            </Styled.Lead>

            {/* 1) Why conventions */}
            <Styled.Section>
                <Styled.H2>Why Conventions Matter</Styled.H2>
                <Styled.List>
                    <li><b>Consistency:</b> similar problems look similar across the repo, so you find things faster.</li>
                    <li><b>Speed:</b> less time bikeshedding in PRs, more time shipping features.</li>
                    <li><b>Onboarding:</b> new contributors understand the project layout and expectations quickly.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Directory & file naming */}
            <Styled.Section>
                <Styled.H2>Directory & File Naming</Styled.H2>
                <Styled.List>
                    <li><b>Kebab-case for routes and folders:</b> <Styled.InlineCode>src/pages/docs</Styled.InlineCode>, <Styled.InlineCode>src/pages/topics/dom-events</Styled.InlineCode>.</li>
                    <li><b>PascalCase for React components:</b> <Styled.InlineCode>NavList.jsx</Styled.InlineCode>, <Styled.InlineCode>ScrollToTop.jsx</Styled.InlineCode>.</li>
                    <li><b>Styled module colocated:</b> <Styled.InlineCode>ComponentName.styled.js</Styled.InlineCode> or a section-level <Styled.InlineCode>styled.js</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example layout
src/
  components/
    Breadcrumbs.jsx
    Footer.jsx
  pages/
    topics/
      docs/
        Conventions.jsx
        styled.js
      dom-events/
        SyntheticEvents.jsx
        styled.js`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Imports & module boundaries */}
            <Styled.Section>
                <Styled.H2>Imports & Module Boundaries</Styled.H2>
                <Styled.List>
                    <li><b>Public vs private modules:</b> expose a minimal API from index files; keep helpers private.</li>
                    <li><b>Absolute imports (optional):</b> set <Styled.InlineCode>vite.config.js</Styled.InlineCode> aliases (e.g., <Styled.InlineCode>@/components</Styled.InlineCode>) to avoid <em>../../../</em> chains.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// vite.config.js (alias example)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } }
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Code style */}
            <Styled.Section>
                <Styled.H2>Code Style (Readable by Default)</Styled.H2>
                <Styled.List>
                    <li><b>Single responsibility:</b> one component does one job; extract sub-components when JSX grows noisy.</li>
                    <li><b>Naming:</b> prefer descriptive names (<Styled.InlineCode>useUserProfile</Styled.InlineCode> over <Styled.InlineCode>useData</Styled.InlineCode>).</li>
                    <li><b>Side effects:</b> keep effects explicit; document cleanup in a comment if non-obvious.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Good: descriptive and focused
function PriceTag({ value, currency = "INR" }) {
  return <span aria-label="price">{currency} {value.toLocaleString()}</span>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Commit messages (Conventional Commits) */}
            <Styled.Section>
                <Styled.H2>Commit Messages (Conventional Commits)</Styled.H2>
                <Styled.Small>
                    <b>Conventional Commits</b> is a simple standard for commit titles like
                    <Styled.InlineCode>feat: add search box</Styled.InlineCode>. It makes changelogs and releases automatic.
                </Styled.Small>
                <Styled.List>
                    <li><b>Format:</b> <Styled.InlineCode>&lt;type&gt;(&lt;scope&gt;): &lt;short summary&gt;</Styled.InlineCode></li>
                    <li><b>Types:</b> <Styled.InlineCode>feat</Styled.InlineCode> (new feature), <Styled.InlineCode>fix</Styled.InlineCode> (bug fix), <Styled.InlineCode>docs</Styled.InlineCode>, <Styled.InlineCode>refactor</Styled.InlineCode>, <Styled.InlineCode>test</Styled.InlineCode>, <Styled.InlineCode>chore</Styled.InlineCode>, <Styled.InlineCode>perf</Styled.InlineCode>.</li>
                    <li><b>Breaking change:</b> add <Styled.InlineCode>!</Styled.InlineCode> (e.g., <Styled.InlineCode>feat!: drop Node 16</Styled.InlineCode>) or include <Styled.InlineCode>BREAKING CHANGE:</Styled.InlineCode> in the body.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Examples
feat(router): add lazy routes for docs section
fix(dom-events): stop propagation bug on card click
docs(conventions): clarify commit types

// With a body
feat(search): debounce input by 150ms

Explain the why, not the what. Link issues if relevant (#123).`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Branching strategy */}
            <Styled.Section>
                <Styled.H2>Branching Strategy</Styled.H2>
                <Styled.Small>
                    A <b>branching strategy</b> is an agreed way to name and merge branches. Two common choices:
                </Styled.Small>
                <Styled.List>
                    <li><b>Trunk-based:</b> one main branch (<Styled.InlineCode>main</Styled.InlineCode>), small PRs, frequent merges; use feature branches like <Styled.InlineCode>feat/search-box</Styled.InlineCode>.</li>
                    <li><b>Gitflow (heavier):</b> long-lived <Styled.InlineCode>develop</Styled.InlineCode> plus release/hotfix branches—better for packaged releases.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Naming
feat/analytics-dashboard
fix/login-redirect
docs/contributing-guide`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Pull Requests & Reviews */}
            <Styled.Section>
                <Styled.H2>Pull Requests & Reviews</Styled.H2>
                <Styled.List>
                    <li><b>Small is king:</b> aim for PRs under ~300 lines; reviewers can give better feedback.</li>
                    <li><b>Checklist:</b> tests updated, screenshots (for UI), notes on risks, migration steps if any.</li>
                    <li><b>Respectful feedback:</b> propose; don't demand. Ask "what do you think about...".</li>
                </Styled.List>
                <Styled.Pre>
                    {`# PR title
feat: add keyboard navigation to sidebar

## Summary
- Arrow keys move focus through nav items
- Home/End jump to first/last
- Adds aria-current usage

## Screenshots
[attach before/after GIFs]

## Risks
- None (behind a flag)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Versioning & releases */}
            <Styled.Section>
                <Styled.H2>Versioning & Releases (SemVer)</Styled.H2>
                <Styled.Small>
                    <b>Semantic Versioning (SemVer)</b> uses <b>MAJOR.MINOR.PATCH</b>: increase
                    MAJOR for breaking changes, MINOR for new features, PATCH for fixes.
                </Styled.Small>
                <Styled.Pre>
                    {`// Examples
1.4.2  // fix only
1.5.0  // new features, no breaking
2.0.0  // breaking changes`}
                </Styled.Pre>
                <Styled.List>
                    <li>Tag releases (<Styled.InlineCode>v1.5.0</Styled.InlineCode>) and generate changelogs from commits.</li>
                    <li>Document migrations in the release notes if anything breaks.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Docs & ADRs */}
            <Styled.Section>
                <Styled.H2>Docs & ADRs</Styled.H2>
                <Styled.Small>
                    An <b>ADR (Architecture Decision Record)</b> captures an important decision, the options considered,
                    and the rationale. It prevents repeating the same discussions later.
                </Styled.Small>
                <Styled.Pre>
                    {`# docs/adrs/0001-routing-strategy.md
## Context
We need stable deep links for GitHub Pages.

## Decision
Use BrowserRouter with basename and only kebab-case slugs.

## Alternatives
HashRouter (pros: simple; cons: ugly URLs)

## Consequences
Cleaner links; need 404 redirect rule on host.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep conventions short and specific—people will follow them.</li>
                    <li><b>Do</b> automate where possible (linters, formatters, commit hooks).</li>
                    <li><b>Do</b> write examples in docs so beginners can copy-paste safely.</li>
                    <li><b>Don't</b> create rules nobody enforces; remove or automate them.</li>
                    <li><b>Don't</b> mix unrelated changes in one PR (hard to review, hard to revert).</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Conventional Commits:</b> a human- and machine-readable commit message standard.</li>
                    <li><b>SemVer:</b> semantic versioning scheme <Styled.InlineCode>MAJOR.MINOR.PATCH</Styled.InlineCode>.</li>
                    <li><b>ADR:</b> a short document recording a significant architectural decision.</li>
                    <li><b>Trunk-based:</b> branching model with frequent merges to <Styled.InlineCode>main</Styled.InlineCode>.</li>
                    <li><b>Gitflow:</b> branching model with long-lived <Styled.InlineCode>develop</Styled.InlineCode> and release branches.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: agree on a few practical rules—names, layout, commits, PRs, and releases—then
                automate them. The goal is to help humans read, review, and maintain the project long after
                the first version ships.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Conventions;
