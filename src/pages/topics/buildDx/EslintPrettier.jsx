import React from "react";
import { Styled } from "./styled";

const EslintPrettier = () => {
    return (
        <Styled.Page>
            <Styled.Title>ESLint &amp; Prettier</Styled.Title>

            <Styled.Lead>
                <b>ESLint</b> is a <i>linter</i> (static code analysis that finds problems and enforces rules).
                <b> Prettier</b> is a <i>formatter</i> (rewrites your code to a consistent style automatically).
                Use them together to keep code <b>correct</b> and <b>consistently styled</b> across the team.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Linter:</b> a tool that analyzes source code without running it to detect bugs, bad patterns, and style violations. Example: <Styled.InlineCode>no-undef</Styled.InlineCode>.</li>
                    <li><b>Formatter:</b> a tool that rewrites code to a uniform style (quotes, spaces, line wraps). Example: <Styled.InlineCode>Prettier</Styled.InlineCode>.</li>
                    <li><b>Static Analysis:</b> reasoning about code by reading it, not executing it.</li>
                    <li><b>AST (Abstract Syntax Tree):</b> a tree representation of code that linters/formatters use to understand structure.</li>
                    <li><b>Rule:</b> a specific check or constraint (e.g., require semicolons, no unused vars).</li>
                    <li><b>Plugin:</b> a package that adds rules/configs for a domain (React, import order, a11y).</li>
                    <li><b>Config:</b> how you turn rules on/off and set options. ESLint supports <b>Flat Config</b> (<Styled.InlineCode>eslint.config.js</Styled.InlineCode>, modern) and <b>Legacy</b> (<Styled.InlineCode>.eslintrc.*</Styled.InlineCode>).</li>
                    <li><b>Parser:</b> translates code text into an AST (e.g., <Styled.InlineCode>@babel/eslint-parser</Styled.InlineCode> or TS parser).</li>
                    <li><b>Env & Globals:</b> predefined environments (browser, node) and allowed global names.</li>
                    <li><b>Ignore:</b> files/folders ESLint/Prettier should skip (e.g., <Styled.InlineCode>dist</Styled.InlineCode>, <Styled.InlineCode>coverage</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) How they work together */}
            <Styled.Section>
                <Styled.H2>How ESLint &amp; Prettier Work Together</Styled.H2>
                <Styled.List>
                    <li><b>Separate concerns:</b> ESLint handles <i>code quality</i>; Prettier handles <i>code style</i>.</li>
                    <li><b>Avoid conflicts:</b> disable ESLint's formatting rules by extending <Styled.InlineCode>eslint-config-prettier</Styled.InlineCode>.</li>
                    <li><b>Two common setups:</b>
                        <ul>
                            <li><b>A. Run Prettier separately</b> (recommended & simple): Scripts for <Styled.InlineCode>lint</Styled.InlineCode> and <Styled.InlineCode>format</Styled.InlineCode>; ESLint doesn't run Prettier.</li>
                            <li><b>B. Integrate via plugin</b>: Use <Styled.InlineCode>eslint-plugin-prettier</Styled.InlineCode> (often via <Styled.InlineCode>plugin:prettier/recommended</Styled.InlineCode>) to report Prettier issues as ESLint errors.</li>
                        </ul>
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Flat config example */}
            <Styled.Section>
                <Styled.H2>ESLint (Flat Config) for Vite + React</Styled.H2>
                <Styled.Small>Modern ESLint uses <Styled.InlineCode>eslint.config.js</Styled.InlineCode> at the root.</Styled.Small>
                <Styled.Pre>
                    {`// eslint.config.js (JS project)
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["dist", "build", "coverage"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { react, "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "off",
      "react/react-in-jsx-scope": "off", // not needed with React 17+
    },
    settings: { react: { version: "detect" } },
  },
  // turn off ESLint formatting rules that conflict with Prettier
  prettier,
];`}
                </Styled.Pre>
                <Styled.Small>
                    The last line applies <Styled.InlineCode>eslint-config-prettier</Styled.InlineCode> to disable formatting rules so Prettier can own the style.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Legacy config example (if you still use .eslintrc) */}
            <Styled.Section>
                <Styled.H2>ESLint (Legacy .eslintrc) — Optional</Styled.H2>
                <Styled.Pre>
                    {`// .eslintrc.cjs
module.exports = {
  env: { browser: true, es2022: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier" // disable conflicting formatting rules
  ],
  settings: { react: { version: "detect" } },
  plugins: ["react", "react-hooks"],
  rules: { "react/react-in-jsx-scope": "off" },
  ignorePatterns: ["dist", "build", "coverage"]
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Prettier config */}
            <Styled.Section>
                <Styled.H2>Prettier Config</Styled.H2>
                <Styled.Pre>
                    {`// .prettierrc.json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}

// .prettierignore
dist
build
coverage
*.min.js`}
                </Styled.Pre>
                <Styled.Small>
                    Prettier ignores ESLint; it just formats text. Keep it focused on <i>style</i>, not correctness.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Package scripts */}
            <Styled.Section>
                <Styled.H2>Package Scripts</Styled.H2>
                <Styled.Pre>
                    {`// package.json (scripts section)
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) VS Code on-save setup */}
            <Styled.Section>
                <Styled.H2>VS Code: Format &amp; Lint on Save</Styled.H2>
                <Styled.Pre>
                    {`// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    This runs Prettier to format, then ESLint to auto-fix fixable issues (imports, etc.).
                </Styled.Small>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep ESLint for quality and Prettier for formatting—separate concerns.</li>
                    <li><b>Do</b> add <Styled.InlineCode>eslint-config-prettier</Styled.InlineCode> to avoid rule conflicts.</li>
                    <li><b>Do</b> run <Styled.InlineCode>eslint --fix</Styled.InlineCode> and <Styled.InlineCode>prettier --write</Styled.InlineCode> in CI or a pre-commit hook.</li>
                    <li><b>Don't</b> double-format: if you use <Styled.InlineCode>eslint-plugin-prettier</Styled.InlineCode>, avoid also running Prettier separately on the same files in the same step.</li>
                    <li><b>Don't</b> mix different formatters (e.g., Prettier and an IDE formatter) at the same time.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Optional: integrate Prettier into ESLint */}
            <Styled.Section>
                <Styled.H2>Optional: Integrate Prettier into ESLint</Styled.H2>
                <Styled.Pre>
                    {`// eslint.config.js snippet (add-on)
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // ... your base config,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error" // report Prettier diffs as ESLint errors
    }
  }
];`}
                </Styled.Pre>
                <Styled.Small>
                    This is convenient for a single "lint" step, but running Prettier separately is simpler and faster.
                </Styled.Small>
            </Styled.Section>

            {/* 10) Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting</Styled.H2>
                <Styled.List>
                    <li><b>IDE formats differently?</b> Ensure the default formatter is Prettier and ESLint fixes run on save.</li>
                    <li><b>Rules fighting with Prettier?</b> Confirm <Styled.InlineCode>eslint-config-prettier</Styled.InlineCode> is last in the config order.</li>
                    <li><b>Ignored files not ignored?</b> Check <Styled.InlineCode>ignorePatterns</Styled.InlineCode>, <Styled.InlineCode>.eslintignore</Styled.InlineCode>, and that the path casing matches.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use ESLint to <b>prevent bugs</b> and Prettier to <b>format consistently</b>. Disable
                conflicting ESLint style rules via <i>eslint-config-prettier</i>, decide whether to run Prettier
                separately or through ESLint, and wire up on-save + CI for a smooth developer experience.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default EslintPrettier;
