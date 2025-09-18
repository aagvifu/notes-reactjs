import { Styled } from "./styled";

const Tokens = () => {
    return (
        <Styled.Page>
            <Styled.Title>Design Tokens</Styled.Title>

            <Styled.Lead>
                <b>Design tokens</b> are the single source of truth for visual/style values
                (colors, spacing, radii, typography, motion, elevation, breakpoints, z-index).
                They replace “magic numbers” with named values that are easy to theme, audit, and reuse.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What are tokens &amp; why use them?</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> named style values consumed by code &amp; design tools.</li>
                    <li><b>Consistency:</b> one change updates every component using that token.</li>
                    <li><b>Theming:</b> light/dark/brand themes swap token values, not component code.</li>
                    <li><b>Cross-platform:</b> same tokens can feed web, mobile, docs, and design files.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core categories */}
            <Styled.Section>
                <Styled.H2>Token categories</Styled.H2>
                <Styled.List>
                    <li><b>Color:</b> text, background, borders, states (hover/active), semantic (success, danger).</li>
                    <li><b>Typography:</b> font families, sizes, weights, line-heights, letter-spacing.</li>
                    <li><b>Spacing:</b> scale for margins/padding/gaps (e.g., 0, 2, 4, 8, 12, 16...).</li>
                    <li><b>Radii:</b> corners (none, sm, md, lg, pill, full).</li>
                    <li><b>Elevation:</b> shadows (elev-1…elev-5), overlays.</li>
                    <li><b>Motion:</b> durations, easing curves, spring configs.</li>
                    <li><b>Breakpoints &amp; layout:</b> sm/md/lg/xl, container widths, gutters.</li>
                    <li><b>Z-index:</b> base → dropdown → sticky → modal → toast → tooltip.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Naming & scales */}
            <Styled.Section>
                <Styled.H2>Naming &amp; scales</Styled.H2>
                <Styled.List>
                    <li><b>Base (primitives):</b> neutral-0…neutral-1000, brand-500, spacing-0…spacing-96.</li>
                    <li><b>Alias (semantic):</b> text-muted, bg-default, border-subtle, success-bg.</li>
                    <li><b>Scales:</b> prefer predictable steps (8px base or fluid with <Styled.InlineCode>clamp()</Styled.InlineCode>).</li>
                    <li><b>Case:</b> kebab-case for CSS variables (<Styled.InlineCode>--color-bg-default</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Example: JS token objects (primitives + semantic) */}
            <Styled.Section>
                <Styled.H2>Example: token objects (JS)</Styled.H2>
                <Styled.Pre>
                    {`// primitives (base)
const primitives = {
  color: {
    neutral: { 0:"#0b0b0c", 50:"#151518", 100:"#1f1f23", 200:"#2a2a30", 300:"#35353d",
               400:"#4a4a55", 500:"#6b6b78", 600:"#8f90a6", 700:"#b3b6c6", 800:"#d7d9e6", 900:"#f2f3f8" },
    brand:   { 400:"#5390ff", 500:"#3b82f6", 600:"#2c6bec" },
    red:     { 500:"#ef4444" }, green:{ 500:"#22c55e" }, yellow:{ 500:"#eab308" }
  },
  space:   { 0:0, 1:2, 2:4, 3:8, 4:12, 5:16, 6:20, 7:24, 8:32, 9:40, 10:48, 11:64 },
  radius:  { none:0, sm:4, md:8, lg:12, xl:16, pill:999, full:9999 },
  z:       { base:0, dropdown:1000, sticky:1100, modal:1200, toast:1300, tooltip:1400 },
  elev:    { 1:"0 1px 2px rgba(0,0,0,.24)", 2:"0 4px 12px rgba(0,0,0,.28)" },
  motion:  { fast:"120ms", normal:"200ms", slow:"320ms", ease:"cubic-bezier(.2,.6,.2,1)" },
  type:    { font:"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
             size:{ xs:"12px", sm:"14px", md:"16px", lg:"18px", xl:"20px", 2: "clamp(24px, 2.8vw, 36px)" },
             weight:{ regular:400, medium:500, semibold:600, bold:700 }, line:{ tight:1.2, normal:1.5 } }
};

// aliases (semantic) reference primitives
const semantic = {
  color: {
    text: { default: primitives.color.neutral[800], muted: primitives.color.neutral[600], inverse:"#ffffff" },
    bg:   { default: primitives.color.neutral[900], elevated: primitives.color.neutral[800], inverse:"#111318" },
    border:{ default: primitives.color.neutral[400], subtle: primitives.color.neutral[300] },
    brand:{ default: primitives.color.brand[500], hover: primitives.color.brand[600] },
    status:{ success: primitives.color.green[500], danger: primitives.color.red[500], warning: primitives.color.yellow[500] }
  }
};`}
                </Styled.Pre>
                <Styled.Small>Keep primitives stable; let semantic tokens vary by theme/brand.</Styled.Small>
            </Styled.Section>

            {/* 5) Expose as CSS variables */}
            <Styled.Section>
                <Styled.H2>Expose tokens as CSS variables</Styled.H2>
                <Styled.Pre>
                    {`/* in a global stylesheet or a Theme component */
:root {
  --color-text-default: #0b0b0c;
  --color-text-muted:   #4a4a55;
  --color-bg-default:   #ffffff;
  --color-bg-elevated:  #f7f8fb;

  --space-0: 0px; --space-1: 2px; --space-2: 4px; --space-3: 8px; --space-4: 12px; --space-5: 16px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-pill: 999px;
  --elev-1: 0 1px 2px rgba(0,0,0,.12);
  --motion-fast: 120ms; --motion-ease: cubic-bezier(.2,.6,.2,1);
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

/* dark theme override */
html[data-theme="dark"] {
  --color-text-default: #e9eaf3;
  --color-text-muted:   #b3b6c6;
  --color-bg-default:   #111318;
  --color-bg-elevated:  #1a1c22;
  --elev-1: 0 1px 2px rgba(0,0,0,.32);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Using tokens in styled-components */}
            <Styled.Section>
                <Styled.H2>Use tokens in components</Styled.H2>
                <Styled.Pre>
                    {`// example: Button using CSS variables
import styled from "styled-components";

const Button = styled.button\`
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle, #2a2a30);
  color: var(--color-text-default);
  background: var(--color-bg-elevated);
  box-shadow: var(--elev-1);
  transition: box-shadow var(--motion-fast) var(--motion-ease), transform var(--motion-fast) var(--motion-ease);

  &:hover { transform: translateY(-1px); }
\`;
`}
                </Styled.Pre>
                <Styled.Small>
                    Prefer tokens over hard-coded values. If a token doesn’t exist yet, add it—don’t inline numbers.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Theme switch (attribute pattern) */}
            <Styled.Section>
                <Styled.H2>Theme switching</Styled.H2>
                <Styled.Pre>
                    {`// attribute-based theming
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
}

// auto respecting system color-scheme
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
if (prefersDark.matches) document.documentElement.setAttribute("data-theme", "dark");
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Responsive & fluid tokens */}
            <Styled.Section>
                <Styled.H2>Responsive &amp; fluid tokens</Styled.H2>
                <Styled.List>
                    <li>Expose <b>breakpoints</b> as tokens and use them consistently.</li>
                    <li>Use <Styled.InlineCode>clamp(min, vw, max)</Styled.InlineCode> for fluid type/spacing.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* breakpoint tokens */
:root { --bp-sm: 640px; --bp-md: 768px; --bp-lg: 1024px; --bp-xl: 1280px; }

/* fluid type token */
:root { --font-fluid-2: clamp(24px, 2.8vw, 36px); }

@media (min-width: 768px) {
  .card { padding: var(--space-6); }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Motion & elevation tokens */}
            <Styled.Section>
                <Styled.H2>Motion &amp; elevation tokens</Styled.H2>
                <Styled.List>
                    <li><b>Motion:</b> durations &amp; easing curves standardize interactions.</li>
                    <li><b>Elevation:</b> consistent shadow ladder avoids arbitrary blur/spread values.</li>
                </Styled.List>
                <Styled.Pre>
                    {`:root {
  --motion-fast: 120ms;
  --motion-normal: 200ms;
  --ease-standard: cubic-bezier(.2,.6,.2,1);
  --elev-1: 0 1px 2px rgba(0,0,0,.16);
  --elev-2: 0 4px 12px rgba(0,0,0,.20);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Accessibility & contrast */}
            <Styled.Section>
                <Styled.H2>Accessibility &amp; contrast</Styled.H2>
                <Styled.List>
                    <li>Create <b>contrast tokens</b> that pass WCAG (AA/AAA) for text on background.</li>
                    <li>Define state tokens (hover/active/focus) that keep contrast above 3:1 for UI elements.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* example semantic contrast pair */
:root {
  --color-text-on-brand: #0b1221; /* on brand-500 */
  --color-brand-500: #3b82f6;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> store every repeated value as a token (color, spacing, radius, shadow, z-index).</li>
                    <li><b>Do</b> use <i>semantic</i> tokens in components (e.g., <Styled.InlineCode>bg-default</Styled.InlineCode>) not raw primitives.</li>
                    <li><b>Do</b> centralize tokens and avoid overrides scattered across components.</li>
                    <li><b>Don’t</b> hard-code “random” pixel values—extend the scale instead.</li>
                    <li><b>Don’t</b> invent new colors for each feature—map to the palette.</li>
                    <li><b>Don’t</b> couple tokens to a component’s internal class names.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Primitive token:</b> low-level base value (e.g., neutral-800).</li>
                    <li><b>Semantic token:</b> context-specific alias (e.g., text-muted).</li>
                    <li><b>Scale:</b> ordered steps for spacing/type/radius (e.g., 0, 2, 4, 8...).</li>
                    <li><b>Theming:</b> swapping token values (not component code) per theme/brand.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Put every visual decision behind a named token. Use primitives for the palette and
                scales, semantic tokens in components, and CSS variables to theme instantly across the app.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Tokens;
