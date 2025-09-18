import React from "react";
import { Styled } from "./styled";

const Monorepo = () => {
    return (
        <Styled.Page>
            <Styled.Title>Monorepo</Styled.Title>

            <Styled.Lead>
                A <b>monorepo</b> is a single repository that contains multiple packages/apps
                managed together (shared tooling, shared CI, shared versioning). It improves
                code sharing and developer experience (DX) when you have related projects.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions (start here)</Styled.H2>
                <Styled.List>
                    <li><b>Monorepo:</b> one Git repo hosting many packages/apps.</li>
                    <li><b>Polyrepo:</b> one repo per package/app (many repos).</li>
                    <li><b>Workspace:</b> a tool feature (npm/pnpm/yarn) that treats subfolders as installable packages with shared node_modules at the root.</li>
                    <li><b>Workspace root:</b> the top-level folder with the main <Styled.InlineCode>package.json</Styled.InlineCode> (and configs like <Styled.InlineCode>turbo.json</Styled.InlineCode>, <Styled.InlineCode>pnpm-workspace.yaml</Styled.InlineCode>).</li>
                    <li><b>Package:</b> a folder with its own <Styled.InlineCode>package.json</Styled.InlineCode> (library or app).</li>
                    <li><b>Hoisting:</b> placing dependencies at the root <Styled.InlineCode>node_modules</Styled.InlineCode> so multiple packages share them.</li>
                    <li><b>Symlink:</b> a file-system link connecting workspace packages so they can import each other locally.</li>
                    <li><b>Peer dependency:</b> a dependency expected to be provided by the consumer (avoid duplicates across packages).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why monorepo */}
            <Styled.Section>
                <Styled.H2>Why use a monorepo?</Styled.H2>
                <Styled.List>
                    <li><b>Shared code:</b> publish and reuse internal libraries without version drift.</li>
                    <li><b>Unified tooling:</b> one ESLint/Prettier/TS config; consistent scripts.</li>
                    <li><b>Atomic changes:</b> update app + lib in one PR and one CI run.</li>
                    <li><b>Faster builds:</b> task caching/“affected” graph skips unrelated work.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Tools overview */}
            <Styled.Section>
                <Styled.H2>Tooling (pick a combo)</Styled.H2>
                <Styled.List>
                    <li><b>Workspaces:</b> npm, pnpm, or yarn (manages install/linking).</li>
                    <li><b>Orchestration:</b> Turborepo or Nx (pipelines, caching, affected graph).</li>
                    <li><b>Releases:</b> Changesets or semantic-release (versioning + publishing).</li>
                    <li><b>Registry:</b> npmjs or private registry (GitHub Packages, Verdaccio, etc.).</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Folder layout */}
            <Styled.Section>
                <Styled.H2>Example folder structure</Styled.H2>
                <Styled.Pre>
                    {`my-workspace/
  package.json           // workspaces + scripts
  pnpm-workspace.yaml    // (pnpm) which folders are workspaces
  turbo.json             // (turborepo) pipeline + cache
  .eslintrc.cjs, .prettierrc
  apps/
    web/                 // Vite React app
      package.json
      src/
    admin/               // Another app
      package.json
      src/
  packages/
    ui/                  // Shared UI library
      package.json
      src/
    utils/               // Shared utilities
      package.json
      src/`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Workspaces config */}
            <Styled.Section>
                <Styled.H2>Workspaces setup (npm / pnpm / yarn)</Styled.H2>
                <Styled.List>
                    <li><b>npm</b> (Node 16+): add <Styled.InlineCode>"workspaces"</Styled.InlineCode> to root <Styled.InlineCode>package.json</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// package.json (root)
{
  "name": "my-workspace",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint",
    "test": "turbo run test"
  }
}`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>pnpm</b>: declare folders in <Styled.InlineCode>pnpm-workspace.yaml</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"`}
                </Styled.Pre>
                <Styled.List>
                    <li><b>yarn</b>: similar to npm; add <Styled.InlineCode>"workspaces"</Styled.InlineCode> (Berry adds more features).</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Local linking between packages */}
            <Styled.Section>
                <Styled.H2>Link packages together</Styled.H2>
                <Styled.Pre>
                    {`// packages/ui/package.json
{
  "name": "@acme/ui",
  "version": "0.1.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs"
}

// apps/web/package.json
{
  "name": "web",
  "version": "0.1.0",
  "dependencies": {
    "@acme/ui": "workspace:*"   // use the local workspace version
  }
}

// packages/ui/src/index.ts
export const Button = () => "button";  // example

// apps/web/src/main.tsx
import { Button } from "@acme/ui";`}
                </Styled.Pre>
                <Styled.Small>
                    Use <Styled.InlineCode>"workspace:*"</Styled.InlineCode> (pnpm/yarn) or a bare version
                    like <Styled.InlineCode>"*" </Styled.InlineCode> in npm to link locally. Workspaces create
                    symlinks so changes in <i>ui</i> are instantly available in <i>web</i>.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Pipelines with Turborepo */}
            <Styled.Section>
                <Styled.H2>Build pipelines & caching (Turborepo)</Styled.H2>
                <Styled.Pre>
                    {`// turbo.json (root)
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}

// packages/ui/package.json
{
  "scripts": {
    "build": "tsup src/index.ts --dts --format cjs,esm",
    "lint": "eslint .",
    "test": "vitest"
  }
}

// apps/web/package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest"
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>dependsOn "^build"</b> means: build all dependencies first (topological order). Turborepo caches task
                    outputs so unchanged packages are skipped on subsequent runs.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Nx (alternative) */}
            <Styled.Section>
                <Styled.H2>Alternative: Nx</Styled.H2>
                <Styled.List>
                    <li><b>Project graph:</b> Nx analyzes imports to know which projects depend on which.</li>
                    <li><b>Affected:</b> run tasks only for projects impacted by the latest changes.</li>
                    <li><b>Remote cache:</b> share build results across CI and dev machines.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// package.json (root)
{
  "scripts": {
    "build": "nx run-many -t build",
    "dev": "nx run-many -t dev --parallel",
    "lint": "nx run-many -t lint",
    "test": "nx run-many -t test"
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Versioning & releases */}
            <Styled.Section>
                <Styled.H2>Versioning & releases (Changesets)</Styled.H2>
                <Styled.List>
                    <li><b>Fixed versions:</b> all packages share one version (easier to reason about).</li>
                    <li><b>Independent versions:</b> each package versions separately (less churn).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "acme/my-workspace" }],
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}

// Create a changeset
# npx changeset
# npx changeset version   // updates versions + changelogs
# npm publish -w @acme/ui // publish a single package
# npm publish --workspaces // publish all (be careful)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Publishing tips */}
            <Styled.Section>
                <Styled.H2>Publishing & registry tips</Styled.H2>
                <Styled.List>
                    <li>Set <Styled.InlineCode>"private": false</Styled.InlineCode> for packages you want to publish.</li>
                    <li>Use a scope (<Styled.InlineCode>@acme/*</Styled.InlineCode>) to group your libraries.</li>
                    <li>CI: inject <Styled.InlineCode>NPM_TOKEN</Styled.InlineCode> for authenticated publishing.</li>
                    <li>Private registries (GitHub Packages) need <Styled.InlineCode>.npmrc</Styled.InlineCode> setup.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Gotchas */}
            <Styled.Section>
                <Styled.H2>Common gotchas</Styled.H2>
                <Styled.List>
                    <li><b>Peer deps:</b> libraries exporting React components should <i>peer</i>-depend on <Styled.InlineCode>react</Styled.InlineCode>/<Styled.InlineCode>react-dom</Styled.InlineCode> to avoid duplicates.</li>
                    <li><b>Hoisting differences:</b> npm/pnpm/yarn hoist differently; lock to one tool.</li>
                    <li><b>Circular deps:</b> avoid package A → B and B → A; break cycles with extraction.</li>
                    <li><b>Path imports:</b> don't import source via relative paths (e.g., <Styled.InlineCode>../../other/src</Styled.InlineCode>); import the package name.</li>
                    <li><b>Build outputs:</b> keep compiled files in <Styled.InlineCode>dist/</Styled.InlineCode> and mark as <Styled.InlineCode>"files"</Styled.InlineCode> in <Styled.InlineCode>package.json</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> centralize ESLint/Prettier/TS configs at the root.</li>
                    <li><b>Do</b> use a task runner (Turborepo/Nx) for caching and affected runs.</li>
                    <li><b>Do</b> keep packages <i>small & focused</i> with clean public APIs.</li>
                    <li><b>Don't</b> commit <Styled.InlineCode>dist/</Styled.InlineCode> unless you have a reason (prefer CI builds).</li>
                    <li><b>Don't</b> mix workspace managers (e.g., pnpm + yarn) in one repo.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (quick ref)</Styled.H2>
                <Styled.List>
                    <li><b>Affected graph:</b> the set of projects impacted by a change (used to skip unrelated builds).</li>
                    <li><b>Remote cache:</b> store/reuse task results across machines/CI.</li>
                    <li><b>Workspace protocol:</b> <Styled.InlineCode>"workspace:*"</Styled.InlineCode> pins to local packages during development.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pick one workspace tool (npm/pnpm/yarn), add Turborepo or Nx for caching +
                affected runs, use Changesets for releases, and keep packages modular with clean APIs.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Monorepo;
