import { Styled } from "./styled";

const CssVariables = () => {
    return (
        <Styled.Page>
            <Styled.Title>CSS Variables (Custom Properties)</Styled.Title>

            <Styled.Lead>
                <b>CSS Variables</b> (a.k.a. <b>custom properties</b>) are dynamic, runtime-evaluated values you define
                with names like <Styled.InlineCode>--brand</Styled.InlineCode> and read with{" "}
                <Styled.InlineCode>var(--brand)</Styled.InlineCode>. Unlike preprocessor variables (Sass/Less), they
                participate in the <b>cascade</b>, <b>inherit</b> by default, can change at runtime (e.g., themes), and
                work inside <Styled.InlineCode>calc()</Styled.InlineCode>, gradients, etc.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Why They Matter</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Custom property:</b> a CSS variable defined on a selector (often <Styled.InlineCode>:root</Styled.InlineCode>)
                        and read via <Styled.InlineCode>var(--name, fallback)</Styled.InlineCode>.
                    </li>
                    <li><b>Runtime &amp; dynamic:</b> updates via class/data-attr toggle without recompiling CSS/JS.</li>
                    <li>
                        <b>Cascade-aware:</b> values can be overridden per component/section for precise theming and
                        contextual tweaks.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Syntax basics */}
            <Styled.Section>
                <Styled.H2>Syntax Basics</Styled.H2>
                <Styled.Pre>
                    {`/* Declare (usually at :root for global defaults) */
:root {
  --brand: #6c5ce7;
  --bg: #0b0b0f;
  --fg: #e7e7ea;
  --radius: 14px;
  --space-3: 12px;
}

/* Use with var() and optional fallback */
.button {
  background: var(--brand, rebeccapurple);
  color: var(--fg, white);
  border-radius: var(--radius, 8px);
  padding: var(--space-3);
}`}
                </Styled.Pre>
                <Styled.Small>
                    The <b>fallback</b> is used only if the variable is <i>unset or invalid</i> at computed time.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Inheritance & scope */}
            <Styled.Section>
                <Styled.H2>Inheritance &amp; Scope</Styled.H2>
                <Styled.List>
                    <li>
                        Custom properties <b>inherit</b>—children see the value from their nearest ancestor unless overridden.
                    </li>
                    <li>
                        Override locally on any container to create contextual themes without extra classes on each child.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`.card {
  background: var(--card-bg, #111);
  color: var(--card-fg, #eee);
}
/* This section re-themes cards inside it only */
.section-alt {
  --card-bg: #0d1224;
  --card-fg: #e6edff;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Theming patterns */}
            <Styled.Section>
                <Styled.H2>Theming Patterns (Light/Dark & More)</Styled.H2>
                <Styled.Pre>
                    {`/* Defaults */
:root {
  --bg: #0b0b0f;
  --fg: #e7e7ea;
  --brand: #6c5ce7;
}
/* Dark / Light via data attribute on <html> */
:root[data-theme="light"] {
  --bg: #ffffff;
  --fg: #111318;
  --brand: #5b4beb;
}

/* Component CSS */
.page {
  background: var(--bg);
  color: var(--fg);
}
.button {
  background: var(--brand);
  color: var(--bg);
}

/* Optional: follow OS preference as default */
@media (prefers-color-scheme: light) {
  :root { --bg: #ffffff; --fg: #111318; }
}`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// React (theme toggle without re-rendering styled-components)
// e.g., in a ThemeToggle component:
function setTheme(next) {
  document.documentElement.setAttribute("data-theme", next); // "light" | "dark"
}`}
                </Styled.Pre>
                <Styled.Small>
                    Toggling the attribute updates styles <b>instantly</b> without re-mounting components.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Tokens: primitive vs semantic */}
            <Styled.Section>
                <Styled.H2>Design Tokens with CSS Variables</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Primitive tokens:</b> base scales (e.g., <Styled.InlineCode>--blue-500</Styled.InlineCode>,
                        <Styled.InlineCode>--space-3</Styled.InlineCode>, <Styled.InlineCode>--radius-2</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Semantic tokens:</b> intent-based (<Styled.InlineCode>--btn-bg</Styled.InlineCode>,
                        <Styled.InlineCode>--panel-bg</Styled.InlineCode>) that map to primitives per theme.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`:root {
  /* primitives */
  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --blue-500: #5b8def; --red-500: #ff6b6b; --gray-900: #0d0f14;

  /* semantics */
  --btn-bg: var(--blue-500);
  --btn-fg: white;
  --panel-bg: var(--gray-900);
}

:root[data-theme="light"] {
  --gray-900: #eef1f6; /* semantics adjust automatically */
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Computed values */}
            <Styled.Section>
                <Styled.H2>Computed Values with <code>calc()</code> &amp; Color Functions</Styled.H2>
                <Styled.Pre>
                    {`:root {
  --base: 16px;
  --gap: calc(var(--base) * 1.25);     /* 20px */
  --shadow: 0 8px 30px hsl(220 40% 2% / 0.35);
  --brand-h: 258; --brand-s: 75%; --brand-l: 62%;
  --brand: hsl(var(--brand-h) var(--brand-s) var(--brand-l));
}
.card { box-shadow: var(--shadow); margin: var(--gap); }
.button { background: var(--brand); }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) With styled-components */}
            <Styled.Section>
                <Styled.H2>Using CSS Variables in styled-components</Styled.H2>
                <Styled.Pre>
                    {`// Keep visual tokens in CSS; styled-components reads them like normal CSS
// Button.jsx
import styled from "styled-components";
export const Button = styled.button\`
  background: var(--btn-bg);
  color: var(--btn-fg);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius, 12px);
  transition: background 120ms ease;
\`;
`}
                </Styled.Pre>
                <Styled.Small>
                    This avoids prop-drilling design values and reduces re-renders on theme changes.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Performance & constraints */}
            <Styled.Section>
                <Styled.H2>Performance &amp; Constraints</Styled.H2>
                <Styled.List>
                    <li>CSS variables update at <b>computed value</b> time—generally fast, even at scale.</li>
                    <li>
                        You <b>cannot</b> use <Styled.InlineCode>var()</Styled.InlineCode> for property names, selectors,
                        or to define media queries. Use them for <i>values</i>.
                    </li>
                    <li>
                        Prefer scoping overrides at reasonable container boundaries to avoid excessive repaint areas on theme
                        toggles.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> put defaults at <Styled.InlineCode>:root</Styled.InlineCode>; override per section as needed.</li>
                    <li><b>Do</b> split primitives vs semantics; map semantics per theme.</li>
                    <li><b>Do</b> use <Styled.InlineCode>var(--x, fallback)</Styled.InlineCode> for resilience.</li>
                    <li><b>Don’t</b> rely on placeholders or hard-coded colors that break theme contrast.</li>
                    <li><b>Don’t</b> overuse variables for one-off values; keep them for reusable tokens.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Custom property:</b> any CSS property whose name starts with <Styled.InlineCode>--</Styled.InlineCode>.</li>
                    <li><b>var()</b>: function to read a custom property with an optional fallback.</li>
                    <li><b>Cascade:</b> rules merging mechanism; nearest match wins, then specificity/source order.</li>
                    <li><b>Inheritance:</b> passing values from parent to child when not overridden.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use CSS variables as your **design token layer**—define defaults at <i>:root</i>, map semantic
                tokens per theme, override locally for context, and plug them directly into styled-components.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CssVariables;
