import React from "react";
import { Styled } from "./styled";

/**
 * VSCodeSetup
 * Section: Tooling → Tooling Around React → VSCode Setup
 *
 * Goal: Give a practical, beginner-friendly setup for React + Vite in VS Code,
 * with plain-English definitions for every technical term and copy-pastable snippets.
 */
const VSCodeSetup = () => {
    return (
        <Styled.Page>
            <Styled.Title>VS Code Setup (for React + Vite)</Styled.Title>

            <Styled.Lead>
                <b>Visual Studio Code (VS Code)</b> is a free, lightweight, cross-platform{" "}
                <b>code editor</b> with a rich <b>extension</b> ecosystem. This guide sets up
                a smooth React workflow with linting, formatting, debugging, and quality-of-life tweaks.
            </Styled.Lead>

            {/* 1) Key definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions (read once)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Editor:</b> An app for writing code. VS Code is an editor (not a full IDE).
                    </li>
                    <li>
                        <b>Extension:</b> A plugin that adds features to VS Code (e.g., React snippets,
                        ESLint integration).
                    </li>
                    <li>
                        <b>Workspace:</b> The folder (your project) you open in VS Code. VS Code stores
                        project-specific settings in <Styled.InlineCode>.vscode/</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Linter:</b> A tool that checks code for problems and style issues. We use{" "}
                        <Styled.InlineCode>ESLint</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Formatter:</b> A tool that rearranges text to a consistent style. We use{" "}
                        <Styled.InlineCode>Prettier</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Format on Save:</b> VS Code feature that runs the formatter every time you save.
                    </li>
                    <li>
                        <b>Code Action:</b> Quick fixes offered by VS Code/ESLint (lightbulb menu).
                    </li>
                    <li>
                        <b>Launch configuration:</b> File that tells VS Code how to run/debug your app
                        (stored in <Styled.InlineCode>.vscode/launch.json</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Recommended extensions */}
            <Styled.Section>
                <Styled.H2>Recommended Extensions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>ESLint</b> — integrates ESLint into VS Code (shows errors/warnings inline).
                    </li>
                    <li>
                        <b>Prettier – Code Formatter</b> — consistent code formatting.
                    </li>
                    <li>
                        <b>JavaScript and TypeScript Nightly</b> (optional) — newer TS/JS language features.
                    </li>
                    <li>
                        <b>Path Intellisense</b> — autocompletes file paths in imports.
                    </li>
                    <li>
                        <b>Auto Rename Tag</b> — renames the closing tag when you rename the opening tag.
                    </li>
                    <li>
                        <b>ES7+ React/Redux/React-Native snippets</b> (optional) — quick React snippets.
                    </li>
                    <li>
                        <b>Code Metrics</b> (for the "code-metrics" topic later) — visual complexity metrics.
                    </li>
                </Styled.List>
                <Styled.Small>
                    Tip: Open the Extensions sidebar and search each name. Install one by one to understand what it adds.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Project-level VS Code settings */}
            <Styled.Section>
                <Styled.H2>Project Settings (<code>.vscode/settings.json</code>)</Styled.H2>
                <Styled.Pre>
                    {`{
  // Use Prettier for formatting
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,

  // Trim whitespace and keep files tidy
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // ESLint: run on save and show fixes
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },

  // JS/TS suggestions
  "javascript.suggest.completeFunctionCalls": true,
  "typescript.suggest.completeFunctionCalls": true,

  // React JSX formatting (Prettier defaults are fine; customize if you like)
  "prettier.singleQuote": true,
  "prettier.trailingComma": "es5",
  "prettier.semi": true
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why project-level?</b> Everyone on the team gets the same behavior. It prevents "works on my machine" issues.
                </Styled.Small>
            </Styled.Section>

            {/* 4) ESLint + Prettier config */}
            <Styled.Section>
                <Styled.H2>ESLint + Prettier (React-friendly config)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>ESLint</b> checks code quality and modern best practices (e.g., Rules of Hooks).
                    </li>
                    <li>
                        <b>Prettier</b> focuses purely on consistent formatting (spaces, quotes, line-wraps).
                    </li>
                    <li>
                        We make them "play nice" together by using the Prettier ESLint config.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// eslint.config.js (Flat config style)
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { window: "readonly", document: "readonly" }
    },
    rules: {
      "react/jsx-uses-react": "off",   // React 17+ JSX transform
      "react/react-in-jsx-scope": "off",
      ...reactHooks.configs.recommended.rules
    },
    settings: { react: { version: "detect" } }
  },
  prettier // <-- turn off rules that conflict with Prettier
];`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Definition:</b> <i>Flat config</i> is ESLint's modern configuration format (using{" "}
                    <Styled.InlineCode>eslint.config.js</Styled.InlineCode>) that replaces{" "}
                    <Styled.InlineCode>.eslintrc</Styled.InlineCode> files.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Prettier config */}
            <Styled.Section>
                <Styled.H2>Prettier Config (<code>prettier.config.cjs</code> or <code>.prettierrc</code>)</Styled.H2>
                <Styled.Pre>
                    {`module.exports = {
  singleQuote: true,
  trailingComma: "es5",
  semi: true,
  printWidth: 100
};`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> Keep Prettier minimal. If teammates argue about style, let Prettier decide and move on.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Snippets: JSX + hooks helpers */}
            <Styled.Section>
                <Styled.H2>Snippets (<code>.vscode/javascriptreact.json</code>)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Snippet:</b> A shortcut that expands to a code template (saves time and typos).
                    </li>
                    <li>
                        File lives at <Styled.InlineCode>.vscode/javascriptreact.json</Styled.InlineCode> for
                        project-only snippets.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`{
  "React Component (styled)": {
    "prefix": "rcs",
    "body": [
      "import React from \\"react\\";",
      "import { Styled } from \\"./styled\\";",
      "",
      "const \\\${1:ComponentName} = () => {",
      "  return (",
                    "    <Styled.Page>",
                        "      <Styled.Title>\\\${1:ComponentName}</Styled.Title>",
                        "      <Styled.Section>",
                            "        <Styled.P>...</Styled.P>",
                            "      </Styled.Section>",
                        "    </Styled.Page>",
                    "  );",
      "};",
                    "",
                    "export default \\\${1:ComponentName};"
                    ],
                    "description": "React component using local Styled system"
  },
                    "useState + useEffect template": {
                        "prefix": "rse",
                    "body": [
                    "const [\\\${1:state}, set\\\${1 / (.*) /\\\${1:/capitalize}/}] = React.useState(\\\${2:null});",
      "React.useEffect(() => {",
      "  \\\${3:// side-effect}",
      "  return () => { \\\${4:// cleanup} };",
      "}, [\\\${5:deps}]);"
                    ],
                    "description": "Common state + effect pattern"
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Note: Inside this code block we escaped every <code>${"{...}"}</code> as <code>\\${"{...}"}</code> so the
                    template literal doesn’t try to interpolate snippet placeholders.
                </Styled.Small>
            </Styled.Section>


            {/* 7) Debugging Vite (Chrome or Edge) */}
            <Styled.Section>
                <Styled.H2>Debugging with VS Code</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Debugging:</b> Running your app with breakpoints so you can pause and inspect values.
                    </li>
                    <li>
                        For Vite + React, we attach VS Code's debugger to the browser.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Vite: Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "\${workspaceFolder}",
      "breakOnLoad": true,
      "sourceMaps": true
    }
  ]
}`}
                </Styled.Pre>
                <Styled.Small>
                    Start Vite (<Styled.InlineCode>npm run dev</Styled.InlineCode>), then press{" "}
                    <b>F5</b> and choose <i>Vite: Chrome</i>. Set breakpoints in your source files.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Quality-of-life tweaks */}
            <Styled.Section>
                <Styled.H2>Quality-of-Life Tweaks</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Autosave:</b> Enable in Settings (search "Files: Auto Save") →{" "}
                        <i>onFocusChange</i> or <i>afterDelay</i>.
                    </li>
                    <li>
                        <b>Terminal:</b> Use the built-in terminal (View → Terminal). Keep one pane for
                        <Styled.InlineCode>dev</Styled.InlineCode> and another for tests or lint.
                    </li>
                    <li>
                        <b>Split Editor:</b> Use <Styled.InlineCode>Ctrl/⌘+\</Styled.InlineCode> to view two files side by side.
                    </li>
                    <li>
                        <b>Peek Definition:</b> <Styled.InlineCode>Alt/Option+F12</Styled.InlineCode> to avoid jumping files.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Do</b> commit <Styled.InlineCode>.vscode/settings.json</Styled.InlineCode> for
                        shared formatting/lint behavior.
                    </li>
                    <li>
                        <b>Do</b> enable <i>Format on Save</i> and ESLint auto-fix to reduce nitpicks in PRs.
                    </li>
                    <li>
                        <b>Don't</b> mix multiple formatters. Pick <i>one</i> (Prettier) as the default formatter.
                    </li>
                    <li>
                        <b>Don't</b> ignore linter errors. They often highlight real bugs (e.g., stale deps in effects).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting</Styled.H2>
                <Styled.List>
                    <li>
                        <b>"ESLint is not working"</b>: Check that the ESLint extension is enabled and that
                        your ESLint config file name matches (e.g., <Styled.InlineCode>eslint.config.js</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>"Prettier didn't format"</b>: Ensure{" "}
                        <Styled.InlineCode>editor.defaultFormatter</Styled.InlineCode> is set to Prettier and
                        you haven't installed a conflicting formatter.
                    </li>
                    <li>
                        <b>"Breakpoints are grey"</b>: Open the exact source file served by Vite, not the
                        compiled output. Make sure <Styled.InlineCode>webRoot</Styled.InlineCode> is{" "}
                        <Styled.InlineCode>\${"{workspaceFolder}"}</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Install ESLint + Prettier, enable format-on-save with auto-fix, add a couple of
                snippets, and wire up debugging. Keep settings in the repo for consistency. Small setup,
                big daily payoff.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default VSCodeSetup;
