import React from "react";
import { Styled } from "./styled";

const Themes = () => {
    return (
        <Styled.Page>
            <Styled.Title>Themes</Styled.Title>

            <Styled.Lead>
                A <b>theme</b> is a set of visual decisions (colors, spacing, typography, radii, shadows)
                applied consistently across the UI. Good theming separates <i>design tokens</i> from components,
                supports <b>light/dark</b>, respects <b>system preference</b>, and keeps <b>contrast &amp; a11y</b> in check.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Goals</Styled.H2>
                <Styled.List>
                    <li><b>Theme:</b> a structured object or set of CSS variables representing your design system.</li>
                    <li><b>Goals:</b> consistent look, single source of truth, quick brand changes, easy dark mode.</li>
                    <li><b>Scope:</b> colors, typography scale, spacing, radii, shadows, elevations, motion prefs.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Building blocks */}
            <Styled.Section>
                <Styled.H2>Building Blocks: Tokens → Theme</Styled.H2>
                <Styled.List>
                    <li><b>Design tokens:</b> atomic values (e.g., <Styled.InlineCode>--color-bg</Styled.InlineCode>, <Styled.InlineCode>--radius-md</Styled.InlineCode>).</li>
                    <li><b>Theme object:</b> a JS structure grouping tokens (for styled-components).</li>
                    <li><b>CSS variables:</b> great for runtime switching + interoperability with plain CSS.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Tokens organized into a theme object (styled-components)
export const lightTheme = {
  name: "light",
  colors: {
    bg:   "#0b0d10", // example dark shell with high-contrast cards (tweak per brand)
    card: "#111418",
    text: "#EAEFF6",
    muted:"#B7C2CE",
    primary: "#5B9DFF",
    ring: "hsla(210, 100%, 60%, 0.35)",
  },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radii: { sm: 6, md: 12, lg: 20 },
  shadow: { sm: "0 1px 2px hsl(210 8% 10% / 0.3)", md: "0 8px 24px hsl(210 8% 10% / 0.35)" },
};

export const darkTheme = {
  ...lightTheme,
  name: "dark",
  colors: {
    bg:   "#0a0c0f",
    card: "#0f1216",
    text: "#E9EEF4",
    muted:"#AAB6C2",
    primary: "#6FB1FF",
    ring: "hsla(210, 100%, 60%, 0.40)",
  },
};`}
                </Styled.Pre>
                <Styled.Small>
                    Keep token names <b>semantic</b> (<i>bg, text, primary</i>) rather than raw (<i>blue-500</i>), so brand changes don’t break your components.
                </Styled.Small>
            </Styled.Section>

            {/* 3) ThemeProvider pattern */}
            <Styled.Section>
                <Styled.H2>Pattern: ThemeProvider (styled-components)</Styled.H2>
                <Styled.Pre>
                    {`import React from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { lightTheme, darkTheme } from "./theme"; // tokens above

const Global = createGlobalStyle\`
  :root { color-scheme: \${({ theme }) => theme.name}; }
  body {
    margin: 0;
    background: \${({ theme }) => theme.colors.bg};
    color: \${({ theme }) => theme.colors.text};
  }
  *:focus-visible { outline: 3px solid \${({ theme }) => theme.colors.ring}; outline-offset: 2px; }
\`;

export function AppShell({ children }) {
  const [mode, setMode] = React.useState("dark"); // "light" | "dark"
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <Global />
      <button onClick={() => setMode(m => (m === "dark" ? "light" : "dark"))}>
        Toggle theme
      </button>
      {children}
    </ThemeProvider>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>ThemeProvider</b> injects the theme into styled components via context. Use <Styled.InlineCode>createGlobalStyle</Styled.InlineCode> for globals like background, fonts, focus rings.
                </Styled.Small>
            </Styled.Section>

            {/* 4) CSS variables approach */}
            <Styled.Section>
                <Styled.H2>Pattern: CSS Variables (data-theme)</Styled.H2>
                <Styled.List>
                    <li>Attach <Styled.InlineCode>data-theme="light|dark"</Styled.InlineCode> on <Styled.InlineCode>&lt;html&gt;</Styled.InlineCode> or a root wrapper.</li>
                    <li>Define variables per theme and consume them in CSS or styled-components.</li>
                    <li>Works well with plain CSS, third-party CSS, and non-React islands.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* globals.css */
:root[data-theme="light"] {
  --bg: #ffffff;
  --text: #131722;
  --primary: #2563eb;
  --ring: 0 0 0 3px rgba(37, 99, 235, 0.35);
}
:root[data-theme="dark"] {
  --bg: #0b0d10;
  --text: #e9eef4;
  --primary: #60a5fa;
  --ring: 0 0 0 3px rgba(96, 165, 250, 0.40);
}
/* usage */
.page { background: var(--bg); color: var(--text); }`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// JS toggle (keeps styled-components optional)
function useHtmlTheme() {
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const system = mql.matches ? "dark" : "light";
    const saved = localStorage.getItem("theme") || system;
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const setTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  };
  return { setTheme };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) System preference & persistence */}
            <Styled.Section>
                <Styled.H2>System Preference &amp; Persistence</Styled.H2>
                <Styled.List>
                    <li>Respect <Styled.InlineCode>prefers-color-scheme</Styled.InlineCode> on first load.</li>
                    <li>Persist user choice to <Styled.InlineCode>localStorage</Styled.InlineCode> and apply it before paint (inline script or minimal hydration flash).</li>
                    <li>Expose an explicit toggle (users may override system for your app).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal inline script (index.html) to avoid flash:
<script>
  (function() {
    try {
      const key = "theme";
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const saved = localStorage.getItem(key) || system;
      document.documentElement.setAttribute("data-theme", saved);
    } catch (e) {}
  })();
</script>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Contrast & a11y */}
            <Styled.Section>
                <Styled.H2>Contrast &amp; Accessibility</Styled.H2>
                <Styled.List>
                    <li>Ensure text contrast ratio ≥ <b>4.5:1</b> (body) and ≥ <b>3:1</b> (large text/icons).</li>
                    <li>Use <Styled.InlineCode>color-scheme</Styled.InlineCode> to hint UA form controls for dark/light.</li>
                    <li>Provide visible focus styles that work on both themes; don’t remove outlines.</li>
                    <li>Respect <Styled.InlineCode>prefers-reduced-motion</Styled.InlineCode> for theme transition animations.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Focus & reduced motion */
*:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  .theme-fade { transition: none !important; }
}` }
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Animating theme changes */}
            <Styled.Section>
                <Styled.H2>Animating Theme Changes</Styled.H2>
                <Styled.List>
                    <li>Fade backgrounds and text with short transitions (150–250ms). Avoid animating layout.</li>
                    <li>Opt-out when users prefer reduced motion.</li>
                </Styled.List>
                <Styled.Pre>
                    {`.theme-fade { transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> centralize tokens and reference them everywhere.</li>
                    <li><b>Do</b> respect system preference on first load and let users override.</li>
                    <li><b>Do</b> keep sufficient contrast and strong focus indicators.</li>
                    <li><b>Don’t</b> hardcode colors inside components; pull from theme/tokens.</li>
                    <li><b>Don’t</b> animate large areas heavily during theme toggles.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Design token:</b> a named, reusable design value (color, size, radius) independent of implementation.</li>
                    <li><b>Theme object:</b> a JS representation of tokens consumed by a theming system.</li>
                    <li><b>CSS variable:</b> a custom property accessible at runtime via <Styled.InlineCode>var(--token)</Styled.InlineCode>.</li>
                    <li><b>Color scheme:</b> user agent hint for default form control styling in light/dark.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: define semantic tokens, wire them through a ThemeProvider <i>or</i> CSS variables,
                respect system preference, persist user choice, and bake in a11y (contrast &amp; focus) from day one.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Themes;
