import React from "react";
import { Styled } from "./styled";

const GlobalCss = () => {
    return (
        <Styled.Page>
            <Styled.Title>Global CSS</Styled.Title>

            <Styled.Lead>
                <b>Global CSS</b> styles apply to the entire document. Use it for browser resets,
                base typography, color tokens/variables, and element defaults. Keep component-specific
                styles local to avoid cascade conflicts.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Global CSS:</b> styles that affect the whole app (not scoped to a component).</li>
                    <li><b>Use cases:</b> reset/normalize, base elements (<Styled.InlineCode>html, body, a, button, input</Styled.InlineCode>), CSS variables, typography scale, dark/light theme roots.</li>
                    <li><b>Goal:</b> consistent foundation + predictable defaults across pages.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Where to place it */}
            <Styled.Section>
                <Styled.H2>Where to Define Global CSS</Styled.H2>
                <Styled.List>
                    <li><b>Vite + React:</b> import a single <Styled.InlineCode>index.css</Styled.InlineCode> in <Styled.InlineCode>main.jsx</Styled.InlineCode>.</li>
                    <li><b>styled-components:</b> add global rules via <Styled.InlineCode>createGlobalStyle</Styled.InlineCode> if you prefer JS-controlled theming.</li>
                    <li><b>CSS Variables:</b> define tokens on <Styled.InlineCode>:root</Styled.InlineCode> (and on <Styled.InlineCode>[data-theme="dark"]</Styled.InlineCode> for dark mode).</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* src/index.css (imported once in main.jsx) */
:root{
  --bg: #0b0b0b;
  --fg: #eaeaea;
  --muted: #b4b4b4;
  --accent: #6ea8fe;
  --radius: 12px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px;
  --font-body: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji","Segoe UI Emoji";
}

@media (prefers-color-scheme: dark){
  :root{ color-scheme: dark; }
}

* { box-sizing: border-box; }
html, body, #root { height: 100%; }
body{
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a{
  color: var(--accent);
  text-decoration: none;
}
a:hover{ text-decoration: underline; }

button, input, select, textarea{
  font: inherit;
  color: inherit;
}

img, svg, video{ display:block; max-width:100%; }

/* Utility examples */
.container{ width: min(1120px, 100% - 32px); margin-inline: auto; }
.visually-hidden{
  position:absolute !important; width:1px; height:1px; margin:-1px; border:0; padding:0;
  clip: rect(0 0 0 0); clip-path: inset(50%); overflow:hidden; white-space:nowrap;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Global via styled-components */}
            <Styled.Section>
                <Styled.H2>Global with styled-components</Styled.H2>
                <Styled.List>
                    <li>Use <Styled.InlineCode>createGlobalStyle</Styled.InlineCode> for theme-aware globals (tokens switch with theme).</li>
                    <li>Render the component once near the root (e.g., inside <Styled.InlineCode>&lt;App /&gt;</Styled.InlineCode>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// theme.js
export const light = { bg:"#ffffff", fg:"#0b0b0b", accent:"#1a73e8" };
export const dark  = { bg:"#0b0b0b", fg:"#eaeaea", accent:"#6ea8fe" };

// GlobalStyle.jsx
import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle\`
  :root { color-scheme: \${({ theme }) => (theme === "dark" ? "dark" : "light")}; }
  body {
    margin:0; background:\${({ theme }) => theme.bg}; color:\${({ theme }) => theme.fg};
    font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans";
  }
  a { color:\${({ theme }) => theme.accent}; }
\`;

// App.jsx
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./GlobalStyle";
function App(){
  const [mode,setMode] = React.useState("dark");
  const theme = mode === "dark" ? dark : light;
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      {/* routes, layout, etc. */}
    </ThemeProvider>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Reset vs Normalize */}
            <Styled.Section>
                <Styled.H2>Reset vs Normalize</Styled.H2>
                <Styled.List>
                    <li><b>Reset:</b> aggressively strips browser styles (all margins, headings, lists). You add back what you need.</li>
                    <li><b>Normalize:</b> makes default rendering consistent across browsers while keeping sensible defaults.</li>
                    <li><b>Tip:</b> Prefer a light normalize and explicit base styles for readability.</li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Tokens & variables */}
            <Styled.Section>
                <Styled.H2>Tokens &amp; CSS Variables</Styled.H2>
                <Styled.List>
                    <li>Keep colors, spacing, radii, shadows as variables on <Styled.InlineCode>:root</Styled.InlineCode>.</li>
                    <li>Switch themes by toggling a class/attribute on <Styled.InlineCode>html</Styled.InlineCode> or <Styled.InlineCode>body</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Toggle attribute for theme switching */
html[data-theme="dark"]{
  --bg:#0b0b0b; --fg:#eaeaea; --accent:#6ea8fe;
}
html[data-theme="light"]{
  --bg:#ffffff; --fg:#0b0b0b; --accent:#1a73e8;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li><b>Overreaching selectors:</b> broad rules (e.g., <Styled.InlineCode>* { }</Styled.InlineCode>) can slow rendering and cause side effects.</li>
                    <li><b>Global component classes:</b> avoid naming that collides with local CSS Modules/styled components.</li>
                    <li><b>Hard-coded colors:</b> prefer variables so dark/light themes and branding are easy.</li>
                    <li><b>Inconsistent box model:</b> always set <Styled.InlineCode>box-sizing: border-box</Styled.InlineCode> globally.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> define global tokens (colors, spacing, fonts) once.</li>
                    <li><b>Do</b> normalize base elements and set consistent typography.</li>
                    <li><b>Do</b> prefer variables + theme toggles over duplicating styles.</li>
                    <li><b>Don’t</b> put component-specific styles in global CSS.</li>
                    <li><b>Don’t</b> rely solely on resets—add meaningful base styles.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Global scope:</b> CSS that applies application-wide (not scoped to a component).</li>
                    <li><b>Normalize:</b> a thin stylesheet to make browsers render elements more consistently.</li>
                    <li><b>Tokens:</b> named design values (color, space, radius) reused across the UI.</li>
                    <li><b>Custom properties:</b> CSS variables defined with <Styled.InlineCode>--name</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: keep globals lean and purposeful—reset/normalize, tokens, base typography, and
                accessibility helpers. Everything else should live in component-scoped styles.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default GlobalCss;
