import { Styled } from "./styled";

const GoodReadme = () => {
    return (
        <Styled.Page>
            <Styled.Title>Good README</Styled.Title>

            <Styled.Lead>
                A <b>README</b> is the front door to your project. It explains <i>what</i> the project is,
                <i>why</i> it exists, and <i>how</i> to use, build, and contribute to it—without making anyone
                dig through the code.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Key Terms (Plain English)</Styled.H2>
                <Styled.List>
                    <li><b>README:</b> A Markdown file (usually <Styled.InlineCode>README.md</Styled.InlineCode>) that tells users what the project is and how to get started.</li>
                    <li><b>Markdown (.md):</b> A lightweight text format that supports headings, code blocks, links, images, and lists.</li>
                    <li><b>Badge:</b> A small image (often from <Styled.InlineCode>shields.io</Styled.InlineCode>) showing status like build passing, version, or license.</li>
                    <li><b>Semantic Versioning (SemVer):</b> Version scheme <Styled.InlineCode>MAJOR.MINOR.PATCH</Styled.InlineCode> (breaking/new/bugfix).</li>
                    <li><b>Changelog:</b> A chronological list of changes in each release (new features, fixes, breaking changes).</li>
                    <li><b>License:</b> Legal text stating how others can use, modify, and distribute your code (MIT, Apache-2.0, etc.).</li>
                    <li><b>Contributing Guide:</b> Steps and rules for people who want to help (branching, PR flow, commit style).</li>
                    <li><b>Code of Conduct:</b> Community rules for respectful communication and behavior.</li>
                    <li><b>ADR (Architecture Decision Record):</b> A short note capturing an important technical decision and its context.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why it matters */}
            <Styled.Section>
                <Styled.H2>Why a Good README Matters</Styled.H2>
                <Styled.List>
                    <li><b>First impressions:</b> Recruiters/teammates decide in seconds if the repo is worth their time.</li>
                    <li><b>Less friction:</b> Clear install/run steps reduce "it doesn't work on my machine."</li>
                    <li><b>Faster collaboration:</b> New contributors don't need to ask basics on chat repeatedly.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) The Essentials */}
            <Styled.Section>
                <Styled.H2>Minimum Sections Every README Should Have</Styled.H2>
                <Styled.List>
                    <li><b>Project name + one-line value prop</b> (what it is and why it exists).</li>
                    <li><b>Screenshots/GIF</b> showing the UI or output.</li>
                    <li><b>Quickstart</b>: install → run in 3-5 commands.</li>
                    <li><b>Configuration</b>: environment variables and defaults.</li>
                    <li><b>Scripts</b> (dev, build, test, lint, format).</li>
                    <li><b>Tech stack</b> with links.</li>
                    <li><b>Contributing</b> + <b>License</b>.</li>
                    <li><b>FAQ/Troubleshooting</b> for the top 3-5 issues.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Example skeleton */}
            <Styled.Section>
                <Styled.H2>Example: Lean, Effective README Skeleton</Styled.H2>
                <Styled.Pre>
                    {`# Project Name
> One line: what problem it solves and for whom.

[![build](https://img.shields.io/badge/build-passing-brightgreen)]()
[![license](https://img.shields.io/badge/license-MIT-blue)]()
[![version](https://img.shields.io/badge/version-1.0.0-informational)]()

## Demo
- Live: https://example.com
- Code: https://github.com/owner/repo
- Screenshot/GIF:
  ![Demo](./docs/demo.gif)

## Features
- ✅ Feature A
- ✅ Feature B
- ✅ Feature C

## Quickstart
\`\`\`bash
# 1) Clone
git clone https://github.com/owner/repo && cd repo

# 2) Install
npm i

# 3) Run dev
npm run dev
\`\`\`

## Configuration
Create a \`.env\` with:
\`\`\`ini
VITE_API_URL=http://localhost:3000
VITE_ANALYTICS_KEY=dev-123
\`\`\`
Defaults live in \`.env.example\`.

## Scripts
- \`npm run dev\` — start dev server
- \`npm run build\` — production build
- \`npm run preview\` — preview prod build
- \`npm run test\` — run tests
- \`npm run lint\`, \`npm run format\` — code quality

## Tech Stack
- Vite, React 18, styled-components
- React Router, React Query
- ESLint, Prettier, Vitest/RTL

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Roadmap
- [ ] Feature X
- [ ] i18n
- [ ] Dark mode polish

## FAQ
**Q:** Build fails on Node 16  
**A:** Use Node 18+ (see \`.nvmrc\`).

## License
MIT © Your Name
`}
                </Styled.Pre>
                <Styled.Small>Copy this as a starting point, then adjust to your project.</Styled.Small>
            </Styled.Section>

            {/* 5) Badges */}
            <Styled.Section>
                <Styled.H2>Badges (When They Help)</Styled.H2>
                <Styled.List>
                    <li><b>Good:</b> build status, version, license, coverage, bundle size, downloads.</li>
                    <li><b>Avoid clutter:</b> 4-6 meaningful badges are enough.</li>
                </Styled.List>
                <Styled.Pre>
                    {`[![build](https://img.shields.io/github/actions/workflow/status/owner/repo/ci.yml)]()
[![coverage](https://img.shields.io/codecov/c/github/owner/repo)]()
[![license](https://img.shields.io/badge/license-MIT-blue)]()
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Screenshots & GIFs */}
            <Styled.Section>
                <Styled.H2>Screenshots & GIFs</Styled.H2>
                <Styled.List>
                    <li>Show the "aha!" moment—home screen, key workflow, before/after.</li>
                    <li>Export short, focused GIFs (2-8s). Add a caption if needed.</li>
                    <li>Keep media under <b>docs/</b> and reference with relative paths.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting (Top Issues)</Styled.H2>
                <Styled.Pre>
                    {`### Node version mismatch
Use Node 18+ (see .nvmrc). Reinstall deps after switching: \`rm -rf node_modules && npm i\`.

### Vite port already in use
Stop the existing process or run: \`npm run dev -- --port=5174\`.

### Env not loaded
Ensure you have \`.env\` or \`.env.local\`. Restart dev server after changes.
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Contributing / Commit style */}
            <Styled.Section>
                <Styled.H2>Contributing & Commit Style (Beginner-Friendly)</Styled.H2>
                <Styled.List>
                    <li><b>Fork → branch → PR:</b> small, focused branches like <Styled.InlineCode>feat/search-box</Styled.InlineCode>.</li>
                    <li><b>Conventional Commits:</b> <Styled.InlineCode>feat:</Styled.InlineCode> new feature, <Styled.InlineCode>fix:</Styled.InlineCode> bug, <Styled.InlineCode>docs:</Styled.InlineCode> docs, <Styled.InlineCode>refactor:</Styled.InlineCode> internal change, etc.</li>
                    <li><b>PR Template:</b> include "what/why/how," screenshots, tests, and checklists.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# .github/pull_request_template.md
## What
Short summary of the change.

## Why
Motivation, linked issue/ADR.

## How
Key implementation points.

## Screenshots
(optional)

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] No breaking changes
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) ADR nudge */}
            <Styled.Section>
                <Styled.H2>Link to Decisions (ADRs)</Styled.H2>
                <Styled.List>
                    <li>When you decide something significant (e.g., "Use React Query over Redux"), create an <b>ADR</b> and link it in the README.</li>
                    <li>Format: context → decision → consequences → alternatives.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# docs/adrs/0001-use-react-query.md
- Context: server state management needed
- Decision: adopt React Query
- Consequences: caching, retries, less boilerplate
- Alternatives: Redux Toolkit Query, SWR`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep the top clean: name, one-liner, badges, demo links.</li>
                    <li><b>Do</b> write copy for humans. Short sentences. Bulleted instructions.</li>
                    <li><b>Do</b> show a working command sequence (copy-paste friendly).</li>
                    <li><b>Don't</b> bury install steps below long philosophy sections.</li>
                    <li><b>Don't</b> flood with 20 badges or 10 screenshots—curate.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Quick checklist */}
            <Styled.Section>
                <Styled.H2>Pre-Publish Checklist</Styled.H2>
                <Styled.List>
                    <li>✅ One-line value prop is crystal clear.</li>
                    <li>✅ Quickstart works on a clean machine.</li>
                    <li>✅ Env vars documented with defaults.</li>
                    <li>✅ License chosen and included.</li>
                    <li>✅ Link to contributing, CoC, and ADRs (if any).</li>
                    <li>✅ At least one screenshot or GIF.</li>
                    <li>✅ Changelog or Releases page exists.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                A good README respects your reader's time. Lead with clarity, show the value quickly,
                and make the first run path effortless. Everything else is a bonus.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default GoodReadme;
