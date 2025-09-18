import React from "react";
import { Styled } from "./styled";

const SupplyChain = () => {
    return (
        <Styled.Page>
            <Styled.Title>Software Supply Chain Security</Styled.Title>

            <Styled.Lead>
                <b>Software supply chain</b> security protects everything that goes into building and running your app:
                third-party packages, transitive dependencies, registries, build tools, CI/CD pipelines, secrets, and the way
                you publish and deploy. The goal is <b>integrity</b> (no tampering), <b>authenticity</b> (trusted sources),
                and <b>reproducibility</b> (same inputs → same outputs).
            </Styled.Lead>

            {/* 1) What & why */}
            <Styled.Section>
                <Styled.H2>What is the Supply Chain? Why it matters</Styled.H2>
                <Styled.List>
                    <li><b>Supply chain:</b> the network of <em>code, tools, and infrastructure</em> used to develop, build, test, and deliver your app.</li>
                    <li><b>Risk:</b> one weak link (a dependency, script, or CI step) can compromise credentials, inject malware, or ship a backdoored build.</li>
                    <li><b>Scope:</b> includes <Styled.InlineCode>package.json</Styled.InlineCode>, lockfiles, registries, build scripts, CI/CD, artifacts, container images, and deploy steps.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Common attack paths */}
            <Styled.Section>
                <Styled.H2>Common Attack Paths (with definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Typosquatting:</b> publishing a package with a misspelled name (e.g., <code>react-don</code>) hoping someone installs it by mistake.</li>
                    <li><b>Dependency confusion:</b> attacker publishes a public package with the <em>same name</em> as an internal one so builds pull the attacker's version.</li>
                    <li><b>Malicious maintainer / hijacked account:</b> a popular package gets a bad release after account takeover or maintainer turns rogue.</li>
                    <li><b>Postinstall scripts:</b> lifecycle scripts (e.g., <code>postinstall</code>) run arbitrary code on install to exfiltrate secrets.</li>
                    <li><b>Unpinned CI actions/tools:</b> building with moving tags (<code>@v3</code>) instead of immutable SHAs can execute changed code later.</li>
                    <li><b>Registry injection / mirror risk:</b> using untrusted registries or mirrors can deliver altered tarballs.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Versions & lockfiles */}
            <Styled.Section>
                <Styled.H2>Pin Your Inputs: Versions, Ranges, and Lockfiles</Styled.H2>
                <Styled.List>
                    <li><b>Semantic Versioning (SemVer):</b> <code>MAJOR.MINOR.PATCH</code> (breaking / features / fixes).</li>
                    <li><b>Caret (^1.2.3):</b> allows MINOR+PATCH updates (<code>&lt;2.0.0</code>). <b>Tilde (~1.2.3):</b> allows PATCH (<code>&lt;1.3.0</code>).</li>
                    <li><b>Exact pin:</b> <code>"1.2.3"</code> installs only that version. Use lockfiles to freeze transitive deps.</li>
                    <li><b>Lockfile:</b> <code>package-lock.json</code>, <code>pnpm-lock.yaml</code>, or <code>yarn.lock</code> records the exact resolved versions + integrity hashes for reproducible builds.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// package.json — safer pins for production apps
{
  "dependencies": {
    "react": "18.3.1",          // exact pin (example)
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "vite": "5.4.8"
  },
  "overrides": {                // npm >=8 / pnpm: force a safe transitive version if needed
    "left-pad": "1.3.0"
  },
  "packageManager": "pnpm@9.10.0" // pin your package manager via Corepack
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use <b>exact versions</b> for prod; manage updates via scheduled PRs (Dependabot/Renovate) after review.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Install-time safety */}
            <Styled.Section>
                <Styled.H2>Install-Time Safety (Local & CI)</Styled.H2>
                <Styled.List>
                    <li><b>Use the lockfile:</b> <Styled.InlineCode>npm ci</Styled.InlineCode> / <Styled.InlineCode>pnpm install --frozen-lockfile</Styled.InlineCode> / <Styled.InlineCode>yarn install --immutable</Styled.InlineCode>.</li>
                    <li><b>Block lifecycle scripts when possible:</b> <Styled.InlineCode>--ignore-scripts</Styled.InlineCode> in CI to stop <code>postinstall</code> from running.</li>
                    <li><b>Scope registries:</b> pin your org scope to a trusted registry in <code>.npmrc</code>; avoid random mirrors.</li>
                    <li><b>Review new packages:</b> check weekly downloads, maintainer activity, and whether source matches the published tarball (<Styled.InlineCode>npm pack --dry-run</Styled.InlineCode>).</li>
                    <li><b>Audit:</b> run dependency audits and fix/override intentionally with review notes.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# Safer installs in CI
npm ci --ignore-scripts
# or
pnpm install --frozen-lockfile --ignore-scripts
# Audit
npm audit --production
pnpm audit --prod`}
                </Styled.Pre>
                <Styled.Pre>
                    {`# .npmrc — examples
audit=true
fund=false
@your-scope:registry=https://npm.pkg.github.com
# Optional: raise the bar
audit-level=moderate`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) CI/CD guardrails */}
            <Styled.Section>
                <Styled.H2>CI/CD Guardrails</Styled.H2>
                <Styled.List>
                    <li><b>Pin actions/tools:</b> reference GitHub Actions by <em>commit SHA</em> (not just a tag like <code>@v4</code>).</li>
                    <li><b>Least privilege secrets:</b> short-lived, environment-scoped tokens; prefer OIDC-based tokens over long-lived PATs.</li>
                    <li><b>Protected environments:</b> required reviews for release, branch protection, and forced checks.</li>
                    <li><b>SBOM:</b> generate a Software Bill of Materials (SPDX/CycloneDX) and store it with artifacts.</li>
                    <li><b>Artifact integrity:</b> sign artifacts (e.g., container images) and verify before deploy.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# .github/workflows/build.yml (snippet)
jobs:
  build:
    steps:
      - name: Checkout
        uses: actions/checkout@<commit-sha>
      - name: Setup Node
        uses: actions/setup-node@<commit-sha>
        with:
          node-version: 20
          cache: 'pnpm'
      - run: corepack enable
      - run: pnpm install --frozen-lockfile --ignore-scripts
      - run: pnpm build
      # - run: sbom-tool ... (emit CycloneDX/SPDX)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Registry & publishing hygiene */}
            <Styled.Section>
                <Styled.H2>Registry & Publishing Hygiene</Styled.H2>
                <Styled.List>
                    <li><b>2FA for publishers:</b> enable two-factor auth on accounts with publish rights.</li>
                    <li><b>Code owners & reviews:</b> require reviews on dependency bumps and release scripts.</li>
                    <li><b>Verify the tarball:</b> run <Styled.InlineCode>npm pack --dry-run</Styled.InlineCode> to see what will ship; ensure no secrets or build junk.</li>
                    <li><b>No secret-using scripts on publish:</b> avoid <code>prepublishOnly</code>/<code>postpublish</code> that hit internal services.</li>
                    <li><b>License & provenance:</b> include a license and repository metadata for traceability.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// package.json — safe publishing hints
{
  "files": ["dist/", "README.md", "LICENSE"],
  "scripts": {
    "build": "vite build",
    "prepare": "husky install" // keep it local; do not require secrets
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Runtime precautions (frontend) */}
            <Styled.Section>
                <Styled.H2>Runtime Precautions (Frontend)</Styled.H2>
                <Styled.List>
                    <li><b>Avoid dynamic <code>eval()</code> / Function constructor:</b> they bypass static analysis and invite injection.</li>
                    <li><b>Static imports preferred:</b> if you must dynamic-import, validate the specifier (don't build it from user input).</li>
                    <li><b>Content Security Policy (CSP):</b> helps restrict where scripts can load from (ties into XSS defense).</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> pin dependencies and commit the lockfile.</li>
                    <li><b>Do</b> run <Styled.InlineCode>npm ci</Styled.InlineCode>/<Styled.InlineCode>pnpm --frozen-lockfile</Styled.InlineCode> in CI.</li>
                    <li><b>Do</b> block <code>postinstall</code> in CI unless absolutely required.</li>
                    <li><b>Do</b> pin CI actions to immutable SHAs and restrict secrets.</li>
                    <li><b>Don't</b> install from untrusted mirrors/registries.</li>
                    <li><b>Don't</b> accept wildcard ranges for prod (e.g., <code>"^"</code> everywhere) without review.</li>
                    <li><b>Don't</b> publish packages without 2FA and a review trail.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Quick recipes */}
            <Styled.Section>
                <Styled.H2>Quick Recipes</Styled.H2>
                <Styled.Pre>
                    {`# Lock down versions and manager
corepack enable
# package.json has: "packageManager": "pnpm@9.10.0"

# CI install (deterministic, no scripts)
pnpm install --frozen-lockfile --ignore-scripts

# Approve dependency updates via PR bots
# (Dependabot/Renovate) with CODEOWNERS review

# Verify publish contents
npm pack --dry-run`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Dependency:</b> a package you declare in <code>dependencies/devDependencies</code>.</li>
                    <li><b>Transitive dependency:</b> a dependency of your dependency (pulled indirectly).</li>
                    <li><b>Lockfile:</b> file that freezes exact versions + integrity hashes for reproducible installs.</li>
                    <li><b>Integrity hash:</b> cryptographic checksum in the lockfile that ensures the tarball content matches what was resolved.</li>
                    <li><b>Lifecycle script:</b> npm/pnpm script that runs automatically on install/publish (e.g., <code>postinstall</code>).</li>
                    <li><b>SBOM:</b> Software Bill of Materials—machine-readable list of components in your build (SPDX/CycloneDX).</li>
                    <li><b>Provenance:</b> traceable evidence of how/where an artifact was built (who built it, from which source, with which tools).</li>
                    <li><b>Least privilege:</b> give every token/role only the permissions it strictly needs.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: lock down versions and package manager, use lockfile-based installs, review and audit new deps,
                restrict registries and lifecycle scripts, pin CI actions, protect secrets, generate SBOMs, and verify what
                you publish and deploy. Treat every step—from install to release—as a potential trust boundary.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SupplyChain;
