import { Styled } from "./styled";

const LintRules = () => {
    return (
        <Styled.Page>
            <Styled.Title>Lint Rules</Styled.Title>

            <Styled.Lead>
                <b>Lint rules</b> are automatic checks that scan your code for mistakes, risky patterns,
                and style inconsistencies—before bugs reach production. A <b>linter</b> (like ESLint)
                reads your files and reports <i>problems</i> (errors/warnings) using a set of <b>rules</b>.
                Good rules act like seatbelts: you barely notice them, but they save you when it matters.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What are lint rules? Why use them?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Rule:</b> a single check (e.g., <Styled.InlineCode>no-unused-vars</Styled.InlineCode>) that
                        the linter applies to every file. It can be configured as <i>off</i>, <i>warn</i>, or <i>error</i>.
                    </li>
                    <li>
                        <b>Preset / Config:</b> a curated bundle of rules (e.g.,{" "}
                        <Styled.InlineCode>eslint:recommended</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>plugin:react/recommended</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Plugin:</b> an add-on that introduces new rules (e.g.,{" "}
                        <Styled.InlineCode>eslint-plugin-react</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>eslint-plugin-jsx-a11y</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>eslint-plugin-react-hooks</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Why:</b> catch bugs early, keep code consistent across teammates, improve readability,
                        and reduce code review nitpicks (style is automated).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core rule categories */}
            <Styled.Section>
                <Styled.H2>Rule categories you'll use in React projects</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Possible Errors:</b> rules that prevent bugs in logic (e.g.,{" "}
                        <Styled.InlineCode>eqeqeq</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>no-undef</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>no-console</Styled.InlineCode> in production).
                    </li>
                    <li>
                        <b>Best Practices:</b> rules that steer you to safer patterns (e.g.,{" "}
                        <Styled.InlineCode>curly</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>no-param-reassign</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>no-implicit-coercion</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Stylistic:</b> spacing, quotes, semicolons—usually delegated to <b>Prettier</b>, while ESLint focuses on correctness.
                    </li>
                    <li>
                        <b>React:</b> component/JSX rules (e.g.,{" "}
                        <Styled.InlineCode>react/jsx-key</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>react/no-array-index-key</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>react/jsx-no-target-blank</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>React Hooks:</b> enforce the <b>Rules of Hooks</b> (e.g.,{" "}
                        <Styled.InlineCode>react-hooks/rules-of-hooks</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>react-hooks/exhaustive-deps</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Accessibility (a11y):</b> assistive-tech friendly UI (e.g.,{" "}
                        <Styled.InlineCode>jsx-a11y/alt-text</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>jsx-a11y/label-has-associated-control</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Imports / Module hygiene:</b> dead code, order, duplicates (e.g.,{" "}
                        <Styled.InlineCode>import/no-unresolved</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>import/order</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal React ESLint + Prettier setup */}
            <Styled.Section>
                <Styled.H2>Minimal React ESLint + Prettier setup</Styled.H2>
                <Styled.Small>
                    Idea: let <b>Prettier</b> handle formatting; let <b>ESLint</b> handle correctness and React-specific rules.
                    The config below disables any ESLint rules that conflict with Prettier.
                </Styled.Small>
                <Styled.Pre>
                    {`// .eslintrc.cjs (example)
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    // Keep this last to disable conflicting styling rules:
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true }
  },
  settings: {
    react: { version: "detect" }
  },
  rules: {
    // Common practical tweaks:
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "eqeqeq": ["error", "always"],   // use === / !==
    "curly": ["error", "all"],       // always use braces
    "no-implicit-coercion": "warn",

    // React specifics:
    "react/jsx-key": "error",
    "react/jsx-no-target-blank": ["error", { allowReferrer: true, enforceDynamicLinks: "always" }],
  }
};`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> Prefer <Styled.InlineCode>plugin:prettier/recommended</Styled.InlineCode> (which turns on{" "}
                    <Styled.InlineCode>eslint-config-prettier</Styled.InlineCode>) over{" "}
                    <Styled.InlineCode>eslint-plugin-prettier</Styled.InlineCode> in most setups—simpler and faster.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Hooks rules (must-know) */}
            <Styled.Section>
                <Styled.H2>Must-know hooks rules</Styled.H2>
                <Styled.List>
                    <li>
                        <b>react-hooks/rules-of-hooks:</b> Only call hooks at the top level of React functions; never in loops, conditions, or nested functions.
                    </li>
                    <li>
                        <b>react-hooks/exhaustive-deps:</b> Verify effect dependency arrays so your effect runs when its inputs change—avoids stale values and infinite loops.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// BAD: conditional hook call
function Example({ enabled }) {
  if (enabled) {
    React.useEffect(() => {
      console.log("runs only when enabled? This breaks the Rules of Hooks.");
    }, []);
  }
  return null;
}

// GOOD: call hook unconditionally, branch inside
function Example({ enabled }) {
  React.useEffect(() => {
    if (!enabled) return;
    console.log("safe");
  }, [enabled]);
  return null;
}`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// Exhaustive deps: include everything used inside the effect that comes from outside
function Search({ query, onResult }) {
  React.useEffect(() => {
    let alive = true;
    fetch("/api?q=" + encodeURIComponent(query))
      .then(r => r.json())
      .then(data => { if (alive) onResult(data); });
    return () => { alive = false; };
  }, [query, onResult]); // include both query and onResult
  return null;
}`}
                </Styled.Pre>
                <Styled.Small>
                    If you intentionally omit deps, comment why. Better: stabilize callbacks with{" "}
                    <Styled.InlineCode>useCallback</Styled.InlineCode> when identity matters.
                </Styled.Small>
            </Styled.Section>

            {/* 5) React JSX rules you'll hit often */}
            <Styled.Section>
                <Styled.H2>Common React/JSX rules</Styled.H2>
                <Styled.List>
                    <li>
                        <b>react/jsx-key:</b> Every list child needs a <Styled.InlineCode>key</Styled.InlineCode> for stable identity.
                    </li>
                    <li>
                        <b>react/no-array-index-key:</b> Avoid using the array index as key when list order can change—it breaks state retention.
                    </li>
                    <li>
                        <b>react/jsx-no-target-blank:</b> When using <Styled.InlineCode>target="_blank"</Styled.InlineCode>, add{" "}
                        <Styled.InlineCode>rel="noopener noreferrer"</Styled.InlineCode> for security.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// OK
{items.map((todo) => (
  <li key={todo.id}>{todo.title}</li>
))}

// RISKY (index key) — reordering can cause weird UI bugs
{items.map((todo, i) => (
  <li key={i}>{todo.title}</li>
))}

// Links — safe external link
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Docs</a>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Accessibility (jsx-a11y) essentials */}
            <Styled.Section>
                <Styled.H2>Accessibility rules (jsx-a11y) you should keep</Styled.H2>
                <Styled.List>
                    <li>
                        <b>jsx-a11y/alt-text:</b> Images need meaningful <Styled.InlineCode>alt</Styled.InlineCode> text (or empty <Styled.InlineCode>alt=""</Styled.InlineCode> if purely decorative).
                    </li>
                    <li>
                        <b>jsx-a11y/label-has-associated-control:</b> Form inputs must be associated with labels.
                    </li>
                    <li>
                        <b>jsx-a11y/click-events-have-key-events:</b> If an element is clickable (non-button), ensure it's keyboard operable too.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Good: labeled input
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Good: image with alt text
<img src="/logo.png" alt="Company logo" />

// If you must use a non-button clickable element:
<div
  role="button"
  tabIndex={0}
  onClick={onOpen}
  onKeyDown={(e) => e.key === "Enter" && onOpen()}
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) General JS rules that save hours */}
            <Styled.Section>
                <Styled.H2>General JS rules that quietly save hours</Styled.H2>
                <Styled.List>
                    <li>
                        <b>no-unused-vars:</b> remove dead variables—signals incomplete refactors or typos.
                    </li>
                    <li>
                        <b>no-undef:</b> prevents references to variables that don't exist.
                    </li>
                    <li>
                        <b>eqeqeq:</b> use strict equality <Styled.InlineCode>===</Styled.InlineCode> to avoid coercion traps.
                    </li>
                    <li>
                        <b>curly:</b> always use braces around blocks—keeps diffs/bugs small.
                    </li>
                    <li>
                        <b>import/order:</b> consistent, readable import grouping.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// no-unused-vars
function greet(name) {
  // 'unused' will trigger a warning
  const unused = 123;
  return "Hello " + name;
}

// eqeqeq
if (count === 0) { /* ... */ } // strict check — good

// curly
if (ok) { doThing(); } else { doOther(); }

// import/order (groups: builtin, external, internal)
import fs from "node:fs";
import React from "react";
import MyWidget from "@/components/MyWidget";`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep rules actionable—too many warnings become noise.</li>
                    <li><b>Do</b> let Prettier handle formatting; keep ESLint for correctness and React specifics.</li>
                    <li><b>Do</b> fix warnings regularly; don't let them pile up.</li>
                    <li><b>Don't</b> disable a rule globally just to fix one file—prefer local <Styled.InlineCode>// eslint-disable-next-line</Styled.InlineCode> with a reason.</li>
                    <li><b>Don't</b> ignore hooks rules—most “random” bugs come from incorrect effects or stale closures.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Linter:</b> a tool that analyzes code to find problems automatically.</li>
                    <li><b>Rule:</b> a single check that reports an error/warning when violated.</li>
                    <li><b>Plugin:</b> an add-on that provides rules for a specific ecosystem (React, a11y).</li>
                    <li><b>Preset (extends):</b> a bundle of recommended rules you can apply at once.</li>
                    <li><b>Formatter:</b> a tool (Prettier) that rewrites code style automatically—spacing, quotes, etc.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: keep ESLint focused on correctness and React rules; let Prettier format.
                Enforce hooks and accessibility rules, add a few high-impact JS rules, and you'll
                prevent the most common bugs—without slowing anyone down.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default LintRules;
