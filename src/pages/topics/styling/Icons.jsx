import React from "react";
import { Styled } from "./styled";

const Icons = () => {
    return (
        <Styled.Page>
            <Styled.Title>Icons</Styled.Title>

            <Styled.Lead>
                Icons should be <b>crisp</b>, <b>themed</b>, and <b>accessible</b>. In React, prefer SVG-based
                approaches for sharp rendering, easy coloring via <Styled.InlineCode>currentColor</Styled.InlineCode>,
                and small bundles through tree-shaking.
            </Styled.Lead>

            {/* 1) Why & when */}
            <Styled.Section>
                <Styled.H2>Why icons &amp; when to use</Styled.H2>
                <Styled.List>
                    <li><b>Communicate fast:</b> reinforce text labels (don’t replace them by default).</li>
                    <li><b>Scalable &amp; sharp:</b> SVGs stay crisp at any size and DPI.</li>
                    <li><b>Theme-friendly:</b> use <Styled.InlineCode>currentColor</Styled.InlineCode> or CSS variables to match dark/light themes.</li>
                    <li><b>A11y first:</b> icon-only controls must have an accessible name via <Styled.InlineCode>aria-label</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Strategies overview */}
            <Styled.Section>
                <Styled.H2>Common strategies in React</Styled.H2>
                <Styled.List>
                    <li><b>Inline SVG component</b> — maximum control, zero runtime dependency.</li>
                    <li><b>react-icons</b> — curated packs (Feather, Material, etc.) with tree-shaking.</li>
                    <li><b>SVG sprite &lt;use&gt;</b> — reference by id; great for many small icons.</li>
                    <li><b>Icon fonts</b> — avoid for a11y/coloring; use SVG instead.</li>
                    <li><b>Raster images (PNG/JPG)</b> — avoid for UI icons; not scalable.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Inline SVG component */}
            <Styled.Section>
                <Styled.H2>Inline SVG component (recommended)</Styled.H2>
                <Styled.Pre>
                    {`// Reusable icon that inherits color/size from CSS (1em)
export function IconCheck(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Usage: inherits font-size and color
// <IconCheck style={{ fontSize: 18, color: "var(--accent)" }} />`}
                </Styled.Pre>
                <Styled.Small>Tip: Use <b>1em</b> sizing so icons scale with text, and color via <b>currentColor</b>.</Styled.Small>
            </Styled.Section>

            {/* 4) react-icons */}
            <Styled.Section>
                <Styled.H2>Using <code>react-icons</code> (tree-shaken packs)</Styled.H2>
                <Styled.List>
                    <li>Import from the <b>pack subpath</b> (e.g., <Styled.InlineCode>"react-icons/fi"</Styled.InlineCode>) to keep bundles small.</li>
                    <li>Pass <Styled.InlineCode>size</Styled.InlineCode> (px) or use CSS to control <Styled.InlineCode>font-size</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { FiSearch, FiTrash2 } from "react-icons/fi";

function Toolbar() {
  return (
    <div className="toolbar">
      {/* Icon-only button must have an accessible name */}
      <button type="button" aria-label="Search">
        <FiSearch size={18} aria-hidden="true" />
      </button>

      {/* Icon + text: hide icon from AT */}
      <button type="button">
        <FiTrash2 aria-hidden="true" />
        <span>Delete</span>
      </button>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Importing from <b>"react-icons"</b> root can bloat bundles; prefer pack subpaths.</Styled.Small>
            </Styled.Section>

            {/* 5) SVG sprite */}
            <Styled.Section>
                <Styled.H2>SVG sprite (&lt;symbol&gt; + &lt;use&gt;)</Styled.H2>
                <Styled.List>
                    <li>Define symbols once (e.g., in <Styled.InlineCode>index.html</Styled.InlineCode> or a bundled sprite file).</li>
                    <li>Reference by id; styles still apply via <Styled.InlineCode>currentColor</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<!-- index.html -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="icon-plus" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" />
  </symbol>
</svg>`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// In React:
function AddButton() {
  return (
    <button type="button" aria-label="Add item">
      <svg width="1em" height="1em" role="img" focusable="false">
        <use href="#icon-plus" />
      </svg>
    </button>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Theming & coloring */}
            <Styled.Section>
                <Styled.H2>Theming &amp; coloring</Styled.H2>
                <Styled.List>
                    <li>Keep <Styled.InlineCode>fill</Styled.InlineCode>/<Styled.InlineCode>stroke</Styled.InlineCode> as <b>currentColor</b>; set color via CSS (tokens/variables).</li>
                    <li>Respect dark mode by deriving from text color or a dedicated token.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* tokens.css (example) */
:root { --icon: hsl(220 10% 40%); --iconAccent: hsl(200 90% 50%); }
.dark { --icon: hsl(0 0% 90%); }

/* usage */
.icon { color: var(--icon); }
.iconAccent { color: var(--iconAccent); }`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// <IconCheck className="icon" />
// <IconCheck className="iconAccent" style={{ fontSize: 20 }} />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Sizing & alignment */}
            <Styled.Section>
                <Styled.H2>Sizing &amp; alignment</Styled.H2>
                <Styled.List>
                    <li>Use <b>1em</b> width/height so icons align with text and scale with font size.</li>
                    <li>Vertically align with text using <Styled.InlineCode>vertical-align: middle</Styled.InlineCode> on the SVG.</li>
                    <li>For icon buttons, use a touch target of at least <b>40×40px</b>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* example */
svg { vertical-align: middle; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) A11y patterns */}
            <Styled.Section>
                <Styled.H2>Accessibility patterns</Styled.H2>
                <Styled.List>
                    <li><b>Decorative</b> icons: add <Styled.InlineCode>aria-hidden="true"</Styled.InlineCode>.</li>
                    <li><b>Icon-only buttons:</b> provide <Styled.InlineCode>aria-label</Styled.InlineCode> or associate visible text.</li>
                    <li><b>Meaning + text:</b> prefer icon + label; don’t rely on icon alone for critical actions.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Icon-only
<button type="button" aria-label="Close">
  <svg width="1em" height="1em" aria-hidden="true" focusable="false">...</svg>
</button>

// Icon + text
<button type="button">
  <svg width="1em" height="1em" aria-hidden="true" focusable="false">...</svg>
  <span>Close</span>
</button>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Performance tips */}
            <Styled.Section>
                <Styled.H2>Performance tips</Styled.H2>
                <Styled.List>
                    <li>Tree-shake by importing specific icons (or build-time SVGO to strip metadata).</li>
                    <li>Prefer a <b>shared</b> sprite or small inline components over large icon bundles.</li>
                    <li>Memoize heavy, animated SVGs if they re-render often.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use SVG with <Styled.InlineCode>currentColor</Styled.InlineCode> and <b>1em</b> sizing.</li>
                    <li><b>Do</b> include accessible names for icon-only controls.</li>
                    <li><b>Do</b> keep imports granular to avoid bundle bloat.</li>
                    <li><b>Don’t</b> rely on icon fonts for critical UI (a11y/ligature issues).</li>
                    <li><b>Don’t</b> ship bitmap icons for UI; they won’t scale cleanly.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: default to SVG, color via <i>currentColor</i> (theme-ready), keep imports granular,
                and ensure icon-only controls have accessible names.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Icons;
