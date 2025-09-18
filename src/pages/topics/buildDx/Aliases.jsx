import React from "react";
import { Styled } from "./styled";

/**
 * Aliases (Build & DX)
 * Beginner-friendly guide to import path aliases in Vite + React.
 */
const Aliases = () => {
    return (
        <Styled.Page>
            <Styled.Title>Aliases (Import Path Aliases)</Styled.Title>

            <Styled.Lead>
                An <b>import path alias</b> is a short, memorable path (like <Styled.InlineCode>@/components</Styled.InlineCode>)
                that maps to a real directory (like <Styled.InlineCode>src/components</Styled.InlineCode>). Aliases improve
                readability, avoid brittle <i>../../../</i> imports, and make refactors easier.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions — start here</Styled.H2>
                <Styled.List>
                    <li><b>Module:</b> a JS/TS file that can import/export values.</li>
                    <li><b>Module resolution:</b> how a tool (Vite/Node/TS) figures out what file an import points to.</li>
                    <li><b>Relative import:</b> path starting with <Styled.InlineCode>./</Styled.InlineCode> or <Styled.InlineCode>../</Styled.InlineCode> (e.g., <Styled.InlineCode>../../utils/format</Styled.InlineCode>).</li>
                    <li><b>Absolute import:</b> path that doesn't depend on the current file's location (e.g., <Styled.InlineCode>src/utils/format</Styled.InlineCode> or an alias like <Styled.InlineCode>@/utils/format</Styled.InlineCode>).</li>
                    <li><b>Alias:</b> a custom prefix (e.g., <Styled.InlineCode>@</Styled.InlineCode>) mapped to a specific folder (e.g., <Styled.InlineCode>src</Styled.InlineCode>).</li>
                    <li><b>DX (Developer Experience):</b> how easy and pleasant it is to develop—good DX saves time and reduces errors.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why use aliases */}
            <Styled.Section>
                <Styled.H2>Why aliases?</Styled.H2>
                <Styled.List>
                    <li><b>Readability:</b> <Styled.InlineCode>@/components/Button</Styled.InlineCode> is clearer than deep relative paths.</li>
                    <li><b>Refactors:</b> Move folders around without rewriting long chains of <Styled.InlineCode>../</Styled.InlineCode>.</li>
                    <li><b>Consistency:</b> The same path works anywhere in your project.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Vite config (JS) */}
            <Styled.Section>
                <Styled.H2>Vite setup (JavaScript)</Styled.H2>
                <Styled.Pre>
                    {`// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
});`}
                </Styled.Pre>
                <Styled.Small>
                    Use <Styled.InlineCode>fileURLToPath(new URL(..., import.meta.url))</Styled.InlineCode> for reliable, cross-platform absolute paths.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Vite config (TS) + TS Paths */}
            <Styled.Section>
                <Styled.H2>Vite setup (TypeScript) + TypeScript paths</Styled.H2>
                <Styled.Pre>
                    {`// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// tsconfig.json (or jsconfig.json for JS projects)
{
  "compilerOptions": {
    "baseUrl": ".",                    // allow absolute-like paths from project root
    "paths": {
      "@/*": ["src/*"],               // keep this in sync with Vite
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Important:</b> Vite's <Styled.InlineCode>resolve.alias</Styled.InlineCode> must match <Styled.InlineCode>paths</Styled.InlineCode> in <i>tsconfig/jsconfig</i>,
                    otherwise your editor and build may disagree.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Using aliases */}
            <Styled.Section>
                <Styled.H2>Using aliases in code</Styled.H2>
                <Styled.Pre>
                    {`// Before (brittle)
import Button from "../../components/Button.jsx";
import { formatDate } from "../../utils/dates.js";

// After (stable, clear)
import Button from "@components/Button.jsx";
import { formatDate } from "@utils/dates.js";

// Common: use "@" to point to /src
import Home from "@/pages/Home.jsx";`}
                </Styled.Pre>
                <Styled.Small>
                    You can mix both styles, but prefer aliases for anything outside the current folder.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Editor & ESLint integration */}
            <Styled.Section>
                <Styled.H2>Editor &amp; ESLint integration</Styled.H2>
                <Styled.List>
                    <li><b>VS Code:</b> ensure <Styled.InlineCode>tsconfig.json</Styled.InlineCode> or <Styled.InlineCode>jsconfig.json</Styled.InlineCode> exists with matching <Styled.InlineCode>paths</Styled.InlineCode>.</li>
                    <li><b>ESLint:</b> configure the import resolver so "unresolved import" errors don't appear.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// .eslintrc.js (example)
module.exports = {
  settings: {
    "import/resolver": {
      // If using TypeScript:
      typescript: {
        project: "./tsconfig.json"
      },
      // Or the generic alias resolver:
      alias: {
        map: [
          ["@", "./src"],
          ["@components", "./src/components"],
          ["@pages", "./src/pages"],
          ["@utils", "./src/utils"]
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Testing (Vitest/Jest) */}
            <Styled.Section>
                <Styled.H2>Testing (Vitest / Jest)</Styled.H2>
                <Styled.List>
                    <li><b>Vitest:</b> it uses your Vite config, so aliases generally "just work".</li>
                    <li><b>Jest:</b> map aliases manually via <Styled.InlineCode>moduleNameMapper</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// vitest.config.ts (only if you need custom test-level aliases)
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  },
  test: { environment: "jsdom" }
});`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// jest.config.js (if using Jest)
module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1"
  }
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Storybook */}
            <Styled.Section>
                <Styled.H2>Storybook</Styled.H2>
                <Styled.List>
                    <li><b>Vite builder:</b> Storybook can merge Vite aliases.</li>
                    <li><b>Webpack builder:</b> set <Styled.InlineCode>webpackFinal.resolve.alias</Styled.InlineCode> to mirror your Vite/TS config.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// .storybook/main.ts (Vite builder)
import { fileURLToPath, URL } from "node:url";
export default {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  viteFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    };
    return config;
  },
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Monorepo note */}
            <Styled.Section>
                <Styled.H2>Monorepos (pnpm / yarn workspaces)</Styled.H2>
                <Styled.List>
                    <li>Prefer importing <b>workspace packages by name</b> (via their <Styled.InlineCode>package.json</Styled.InlineCode><i>name</i>).</li>
                    <li>For shared internal libs, expose proper <Styled.InlineCode>exports</Styled.InlineCode> and set project-wide TS <Styled.InlineCode>paths</Styled.InlineCode> only for local apps.</li>
                    <li>Keep aliases consistent across <Styled.InlineCode>vite.config.*</Styled.InlineCode> and <Styled.InlineCode>tsconfig*</Styled.InlineCode> files within each package.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> choose a single root alias (commonly <Styled.InlineCode>@</Styled.InlineCode>) and stick to it.</li>
                    <li><b>Do</b> keep Vite <Styled.InlineCode>resolve.alias</Styled.InlineCode> in sync with TS/JS <Styled.InlineCode>paths</Styled.InlineCode>.</li>
                    <li><b>Do</b> organize a few clear aliases (<Styled.InlineCode>@</Styled.InlineCode>, <Styled.InlineCode>@components</Styled.InlineCode>, <Styled.InlineCode>@utils</Styled.InlineCode>), not dozens.</li>
                    <li><b>Don't</b> mix many relative and alias paths in the same folder—pick one style for consistency.</li>
                    <li><b>Don't</b> forget editor/ESLint/test configs—otherwise imports may work in build but show red squiggles or fail tests.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Alias:</b> custom prefix that maps to a folder.</li>
                    <li><b>Base URL:</b> the root used for resolving non-relative paths in TS/JS configs.</li>
                    <li><b>Resolver:</b> a plugin or rule set that turns an import string into a file on disk.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: define aliases in <i>vite.config.*</i> and mirror them in <i>tsconfig/jsconfig</i>.
                Use them consistently for cleaner imports, easier refactors, and better DX.
                Keep ESLint, tests, and Storybook in sync to avoid surprises.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Aliases;
