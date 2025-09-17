import React from "react";
import { Styled } from "./styled";

const PkgScripts = () => {
    return (
        <Styled.Page>
            <Styled.Title>PKG Scripts (package.json)</Styled.Title>
            <Styled.Lead>
                Scripts are short aliases to run common tasks: dev server, build,
                preview, lint/format, tests, deploy, and utility commands. The same
                ideas work with npm, pnpm, and yarn.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Core scripts</Styled.H2>
                <Styled.Pre>
                    {`// package.json (scripts only)
{
  "scripts": {
    "dev": "vite",
    "dev:open": "vite --open",
    "dev:host": "vite --host",                 // access from LAN / phone
    "build": "vite build",
    "preview": "vite preview --host --strictPort",
    "clean": "rimraf dist"                     // needs: npm i -D rimraf
  }
}`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>dev</b>: starts Vite dev server with HMR.</li>
                    <li><b>build</b>: produces optimized production bundles in <Styled.InlineCode>dist/</Styled.InlineCode>.</li>
                    <li><b>preview</b>: serves the built app locally to verify prod output.</li>
                    <li><b>clean</b>: removes previous build artifacts (cross-platform via <Styled.InlineCode>rimraf</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Linting & formatting</Styled.H2>
                <Styled.Pre>
                    {`// dev deps (example)
// npm i -D eslint prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-prettier eslint-config-prettier

// package.json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx",
    "lint:fix": "eslint . --ext .js,.jsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "npm run lint && npm run format:check"
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>check</b> is handy in CI to fail builds on lint or formatting issues.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Environment modes</Styled.H2>
                <p>
                    The <Styled.InlineCode>--mode</Styled.InlineCode> flag loads matching env files
                    (e.g., <Styled.InlineCode>.env.staging</Styled.InlineCode>). Use it for staging builds or previews.
                </p>
                <Styled.Pre>
                    {`{
  "scripts": {
    "dev:staging": "vite --mode staging",
    "build:staging": "vite build --mode staging",
    "preview:staging": "vite preview --mode staging --host"
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Combine with <Styled.InlineCode>.env.staging</Styled.InlineCode> variables (see the <b>.env Files</b> note).
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Tests (optional wiring)</Styled.H2>
                <p>
                    A minimal setup uses Jest + React Testing Library or Vitest. Example with Jest:
                </p>
                <Styled.Pre>
                    {`// dev deps (example)
// npm i -D jest @testing-library/react @testing-library/jest-dom babel-jest @babel/preset-env @babel/preset-react

{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci --runInBand",
    "coverage": "jest --coverage"
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    For Vitest: <Styled.InlineCode>npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom</Styled.InlineCode> and use <Styled.InlineCode>vitest</Styled.InlineCode> in scripts.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Bundle analysis (optional)</Styled.H2>
                <p>Useful to inspect what ships in production builds.</p>
                <Styled.Pre>
                    {`// npm i -D rollup-plugin-visualizer

// vite.config.js (snippet)
// import { visualizer } from "rollup-plugin-visualizer";
// export default defineConfig({
//   plugins: [react(), visualizer({ open: true })]
// });

// package.json
{
  "scripts": {
    "analyze": "vite build && vite preview"   // visualizer opens a treemap after build
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Concurrent/serial tasks (quality gates)</Styled.H2>
                <p>
                    For chaining tasks, keep it simple with built-in <em>&amp;&amp;</em> or
                    add utilities for cross-platform concurrency.
                </p>
                <Styled.Pre>
                    {`// npm i -D npm-run-all concurrently

{
  "scripts": {
    "precommit": "run-s lint:fix format",
    "dev:all": "concurrently \\"npm:dev\\" \\"npm:lint -- --watch\\""
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>npm-run-all</b> provides <Styled.InlineCode>run-s</Styled.InlineCode> (serial) and <Styled.InlineCode>run-p</Styled.InlineCode> (parallel).
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Pre-commit hooks (optional)</Styled.H2>
                <p>
                    Husky + lint-staged help keep commits clean by running linters on staged files only.
                </p>
                <Styled.Pre>
                    {`// npm i -D husky lint-staged
// npx husky init   # creates .husky/ pre-commit

// package.json
{
  "lint-staged": {
    "*.{js,jsx,css,md}": [
      "prettier --write"
    ],
    "*.{js,jsx}": [
      "eslint --fix"
    ]
  }
}

// .husky/pre-commit
npx lint-staged`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Deploy to GitHub Pages (one-liner option)</Styled.H2>
                <p>For repos deployed under <em>/REPO_NAME/</em>, set <Styled.InlineCode>base</Styled.InlineCode> in <em>vite.config.js</em> and add:</p>
                <Styled.Pre>
                    {`// npm i -D gh-pages

{
  "scripts": {
    "predeploy": "vite build",
    "deploy": "gh-pages -d dist"
  }
}
# usage
# npm run deploy  // pushes dist/ to gh-pages branch`}
                </Styled.Pre>
                <Styled.Small>
                    Ensure a SPA fallback (e.g., <code>public/404.html</code> redirect) when using <b>BrowserRouter</b>.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Troubleshooting helpers</Styled.H2>
                <Styled.List>
                    <li>
                        Large projects: increase Node memory for builds —{" "}
                        <Styled.InlineCode>cross-env NODE_OPTIONS="--max-old-space-size=4096"</Styled.InlineCode>{' '}
                        before the build command (needs <code>cross-env</code> on Windows).
                    </li>
                    <li>
                        Windows path issues: prefer cross-platform tools like{" "}
                        <Styled.InlineCode>rimraf</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>cross-env</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>npm-run-all</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// npm i -D cross-env
{
  "scripts": {
    "build:big": "cross-env NODE_OPTIONS=--max-old-space-size=4096 vite build"
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Callout>
                Summary: start with <b>dev / build / preview / clean</b>. Add lint/format and checks
                for consistency, optional test scripts for reliability, analysis for bundle insight,
                and a deploy script for GH Pages. Keep scripts small and composable.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default PkgScripts;
