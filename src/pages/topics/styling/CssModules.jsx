// src/pages/topics/styling/CssModules.jsx
import React from "react";
import { Styled } from "./styled";

const CssModules = () => {
    return (
        <Styled.Page>
            <Styled.Title>CSS Modules</Styled.Title>

            <Styled.Lead>
                <b>CSS Modules</b> scope your styles to the component by default. You write plain CSS in a
                file named <Styled.InlineCode>*.module.css</Styled.InlineCode>, import it in your component,
                and use generated class names from the imported <Styled.InlineCode>styles</Styled.InlineCode> object.
                This avoids global collisions and makes styles easy to reason about.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>What:</b> A build-time technique that <i>localizes</i> class names from CSS files so
                        they don’t leak into the global scope.
                    </li>
                    <li>
                        <b>Why:</b> Prevents naming conflicts, enables component-level styling, and keeps styles
                        maintainable in large apps.
                    </li>
                    <li>
                        <b>How:</b> Import a module file (
                        <Styled.InlineCode>import styles from "./Button.module.css"</Styled.InlineCode>) and use
                        <Styled.InlineCode>styles.className</Styled.InlineCode> on elements.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) File naming & import */}
            <Styled.Section>
                <Styled.H2>File Naming & Import</Styled.H2>
                <Styled.List>
                    <li>
                        Name files <Styled.InlineCode>*.module.css</Styled.InlineCode> (e.g.,
                        <Styled.InlineCode>Button.module.css</Styled.InlineCode>).
                    </li>
                    <li>
                        Import in the component and reference classes via the <b>exported object</b>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Button.module.css */
.button {
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid hsl(0 0% 100% / 0.12);
  background: hsl(220 15% 16%);
  color: white;
}
.primary {
  background: hsl(220 90% 56%);
  border-color: hsl(220 90% 56%);
}
.button:hover { filter: brightness(1.05); }`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// Button.jsx
import React from "react";
import styles from "./Button.module.css";

export default function Button({ children, primary, ...props }) {
  const className = [
    styles.button,
    primary ? styles.primary : null
  ].filter(Boolean).join(" ");

  return <button className={className} {...props}>{children}</button>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Multiple & conditional classes */}
            <Styled.Section>
                <Styled.H2>Multiple &amp; Conditional Classes</Styled.H2>
                <Styled.List>
                    <li>
                        Combine classes by joining strings or use a helper like <b>clsx</b> (optional dependency).
                    </li>
                    <li>
                        Keep logic in JS; the module only provides <em>scoped</em> class names.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// With a tiny helper:
const cx = (...xs) => xs.filter(Boolean).join(" ");

// Usage:
<button className={cx(styles.button, isActive && styles.active)} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Pseudo-classes, media queries, assets */}
            <Styled.Section>
                <Styled.H2>Pseudo-classes, Media Queries &amp; Assets</Styled.H2>
                <Styled.List>
                    <li>Write normal CSS: <Styled.InlineCode>:hover</Styled.InlineCode>, <Styled.InlineCode>:focus</Styled.InlineCode>, <Styled.InlineCode>@media</Styled.InlineCode>.</li>
                    <li>Assets via <Styled.InlineCode>url()</Styled.InlineCode> work through the bundler (Vite).</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Card.module.css */
.card {
  padding: 16px;
  border-radius: 12px;
  background: url("./paper-texture.png");
}
.card:focus-within { outline: 2px solid hsl(200 90% 60%); }
@media (width < 640px) {
  .card { padding: 12px; }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Local vs global selectors */}
            <Styled.Section>
                <Styled.H2>Local vs Global Selectors</Styled.H2>
                <Styled.List>
                    <li>
                        Classes are <b>local by default</b>. To reach global markup (e.g., 3rd-party widgets),
                        use <Styled.InlineCode>:global(...)</Styled.InlineCode> carefully.
                    </li>
                    <li>
                        Avoid overusing globals; they defeat the purpose of modules.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Search.module.css */
.wrapper { display: grid; gap: 8px; }

/* target a library's global class safely */
:global(.rc-virtual-list) {
  max-height: 320px;
}
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Composition & reuse */}
            <Styled.Section>
                <Styled.H2>Composition &amp; Reuse</Styled.H2>
                <Styled.List>
                    <li>
                        Reuse rules with <Styled.InlineCode>composes</Styled.InlineCode> to avoid duplication.
                    </li>
                    <li>
                        Compose from the <i>same</i> file or another module file.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* mixins.module.css */
.baseButton {
  font: 600 14px/1 system-ui, sans-serif;
  border-radius: 10px;
  padding: 10px 14px;
}

/* Button.module.css */
.primary {
  composes: baseButton from "./mixins.module.css";
  background: hsl(220 90% 56%);
  color: white;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Data attributes & state styling */}
            <Styled.Section>
                <Styled.H2>Data Attributes &amp; State Styling</Styled.H2>
                <Styled.List>
                    <li>
                        Prefer <Styled.InlineCode>data-*</Styled.InlineCode> attributes for variant/state hooks
                        instead of creating many class permutations.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Switch.module.css */
.switch { padding: 6px 10px; border-radius: 999px; }
.switch[data-state="on"]  { background: hsl(142 70% 45%); color: white; }
.switch[data-state="off"] { background: hsl(0 0% 20%);  color: white; }`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// Switch.jsx
import styles from "./Switch.module.css";
export function Switch({ on, ...props }) {
  return (
    <button
      className={styles.switch}
      data-state={on ? "on" : "off"}
      {...props}
    >
      {on ? "On" : "Off"}
    </button>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) CSS variables with modules */}
            <Styled.Section>
                <Styled.H2>CSS Variables with Modules (Themes &amp; Tokens)</Styled.H2>
                <Styled.List>
                    <li>
                        Keep <b>design tokens</b> as CSS variables (global or at a theme wrapper). Modules read them just like normal CSS.
                    </li>
                    <li>
                        Switch themes by toggling a parent class or <Styled.InlineCode>data-theme</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* globals.css (not a module) */
:root { --btn-bg: hsl(220 15% 16%); --btn-fg: white; }
[data-theme="dark"]  { --btn-bg: hsl(220 15% 16%); }
[data-theme="light"] { --btn-bg: hsl(0 0% 95%);  --btn-fg: black; }`}
                </Styled.Pre>
                <Styled.Pre>
                    {`/* Button.module.css */
.button { background: var(--btn-bg); color: var(--btn-fg); }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Animations (note) */}
            <Styled.Section>
                <Styled.H2>Animations (Note)</Styled.H2>
                <Styled.List>
                    <li>
                        Keyframe names are global. Use distinctive names or wrap with{" "}
                        <Styled.InlineCode>:global</Styled.InlineCode> if needed to avoid collisions.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Tag.module.css */
@keyframes tagPulse { from { opacity: 0.7; } to { opacity: 1; } }
.tag { animation: tagPulse 1s ease-in-out infinite alternate; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep module files small and co-located with their component.</li>
                    <li><b>Do</b> use <Styled.InlineCode>data-*</Styled.InlineCode> attributes for state/variants.</li>
                    <li><b>Do</b> prefer composition over deep selector chains.</li>
                    <li><b>Don’t</b> overuse <Styled.InlineCode>:global</Styled.InlineCode>—it defeats scoping.</li>
                    <li><b>Don’t</b> rely on class name strings; always reference via <Styled.InlineCode>styles.name</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Forgetting the .module.css suffix:</b> then the file is treated as global CSS and{" "}
                        <Styled.InlineCode>import styles</Styled.InlineCode> won’t work.
                    </li>
                    <li>
                        <b>Mismatched class names:</b> using <Styled.InlineCode>styles.Button</Styled.InlineCode>{" "}
                        when the CSS defines <Styled.InlineCode>.button</Styled.InlineCode> (case matters).
                    </li>
                    <li>
                        <b>Leaky globals:</b> sprinkling <Styled.InlineCode>:global</Styled.InlineCode> everywhere
                        reintroduces global collisions—use sparingly.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Local scope:</b> classes get unique names (hashed) so they don’t collide app-wide.</li>
                    <li><b>Composition:</b> reusing rules across classes with <Styled.InlineCode>composes</Styled.InlineCode>.</li>
                    <li><b>Module object:</b> the imported JS object mapping local class names to hashed strings.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: CSS Modules give you component-scoped, collision-free styles with plain CSS.
                Co-locate styles, compose for reuse, keep globals rare, and leverage CSS variables for themes.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CssModules;
