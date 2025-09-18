import { Styled } from "./styled";

const StyledComponents = () => {
    return (
        <Styled.Page>
            <Styled.Title>styled-components</Styled.Title>

            <Styled.Lead>
                <b>styled-components</b> is a CSS-in-JS library for React that lets you write actual CSS in
                JavaScript. Styles are scoped to components, support dynamic props, and integrate with themes.
                You get predictable class names, automatic vendor prefixes, and co-located styles.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Component-scoped styles:</b> each styled component renders a unique class name, so CSS
                        doesn’t leak or collide.
                    </li>
                    <li>
                        <b>Dynamic styling:</b> compute styles from props or context (theme) without juggling class
                        name strings.
                    </li>
                    <li>
                        <b>Theming:</b> a single <Styled.InlineCode>ThemeProvider</Styled.InlineCode> supplies shared
                        tokens (colors, spacing, radii, etc.).
                    </li>
                    <li>
                        <b>Developer UX:</b> real CSS syntax, nesting via <Styled.InlineCode>&amp;</Styled.InlineCode>,
                        media queries, keyframes, and composition.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic example */}
            <Styled.Section>
                <Styled.H2>Basic Usage</Styled.H2>
                <Styled.Pre>
                    {`import styled from "styled-components";

const Button = styled.button\`
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  background: \${({ theme }) => theme.colors.primary};
  color: \${({ theme }) => theme.colors.onPrimary};
  &:hover { filter: brightness(1.05); }
  &:focus-visible { outline: none; box-shadow: 0 0 0 3px \${({ theme }) => theme.colors.focus}; }
\`;

export default function Example() {
  return <Button>Save</Button>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Styles are real CSS inside a template literal. Theme values are accessed via{" "}
                    <Styled.InlineCode>({"{ theme }"}) =&gt; ...</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Theming */}
            <Styled.Section>
                <Styled.H2>Theming with <code>ThemeProvider</code></Styled.H2>
                <Styled.Pre>
                    {`import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    primary: "#4f46e5",
    onPrimary: "white",
    focus: "hsl(240 100% 60% / 0.35)",
    surface: "#0b0b0c",
    text: "hsl(0 0% 98%)"
  },
  space: (n) => \`\${n * 4}px\`,
  radius: { sm: "8px", md: "12px", xl: "20px" }
};

export function AppRoot() {
  return (
    <ThemeProvider theme={theme}>
      {/* your app */}
    </ThemeProvider>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Keep token names stable (<Styled.InlineCode>colors.primary</Styled.InlineCode>,{" "}
                    <Styled.InlineCode>space(2)</Styled.InlineCode>) to make refactors easy.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Variants (transient props) */}
            <Styled.Section>
                <Styled.H2>Variants &amp; Transient Props</Styled.H2>
                <Styled.List>
                    <li>
                        Use <b>transient props</b> (prefix with <Styled.InlineCode>$</Styled.InlineCode>) to avoid
                        leaking design props to the DOM.
                    </li>
                    <li>
                        Build variants with the <Styled.InlineCode>css</Styled.InlineCode> helper and a small map.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import styled, { css } from "styled-components";

const VARIANTS = {
  primary: css\`
    background: \${({ theme }) => theme.colors.primary};
    color: \${({ theme }) => theme.colors.onPrimary};
  \`,
  ghost: css\`
    background: transparent;
    border: 1px solid hsl(0 0% 100% / 0.14);
    color: \${({ theme }) => theme.colors.text};
  \`,
};

const SIZES = {
  sm: css\`padding: 6px 10px; font-size: 14px;\`,
  md: css\`padding: 10px 16px; font-size: 15px;\`,
  lg: css\`padding: 14px 20px; font-size: 16px;\`,
};

export const Button = styled.button\`
  border-radius: \${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  cursor: pointer;
  \${({ $variant = "primary" }) => VARIANTS[$variant]}
  \${({ $size = "md" }) => SIZES[$size]}
\`;

// Usage:
// <Button $variant="ghost" $size="sm">Cancel</Button>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Extending & composing */}
            <Styled.Section>
                <Styled.H2>Extending &amp; Composing Styles</Styled.H2>
                <Styled.Pre>
                    {`import styled from "styled-components";

export const Button = styled.button\`
  padding: 10px 16px;
  border-radius: 10px;
\`;

export const IconButton = styled(Button)\`
  padding: 8px;
  display: inline-grid;
  place-items: center;
  width: 36px; height: 36px;
\`;`}
                </Styled.Pre>
                <Styled.Small>
                    Extending keeps variants consistent and avoids duplicating base rules.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Polymorphic `as` prop */}
            <Styled.Section>
                <Styled.H2>Polymorphic Rendering (<code>as</code> prop)</Styled.H2>
                <Styled.Pre>
                    {`<Button as="a" href="/pricing">View Pricing</Button>`}
                </Styled.Pre>
                <Styled.Small>
                    Use semantic elements when possible (e.g., render as{" "}
                    <Styled.InlineCode>&lt;a&gt;</Styled.InlineCode> for links).
                </Styled.Small>
            </Styled.Section>

            {/* 7) attrs() for defaults */}
            <Styled.Section>
                <Styled.H2>attrs() for Defaults &amp; Accessibility</Styled.H2>
                <Styled.Pre>
                    {`const Submit = styled(Button).attrs({ type: "submit" })\`
  width: 100%;
\`;

// Renders <button type="submit">...`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Keyframes & animation */}
            <Styled.Section>
                <Styled.H2>Keyframes &amp; Animation</Styled.H2>
                <Styled.Pre>
                    {`import styled, { keyframes } from "styled-components";

const pulse = keyframes\`
  from { transform: scale(1); }
  50%  { transform: scale(1.03); }
  to   { transform: scale(1); }
\`;

export const PulsingCard = styled.div\`
  border-radius: 16px;
  padding: 16px;
  animation: \${pulse} 2.2s ease-in-out infinite;
\`;`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Global styles (when needed) */}
            <Styled.Section>
                <Styled.H2>Global Styles (sparingly)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>createGlobalStyle</Styled.InlineCode> for resets and app-wide
                        variables; keep most styling component-scoped.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle\`
  :root {
    --radius-xl: \${({ theme }) => theme.radius.xl};
  }
  body {
    background: \${({ theme }) => theme.colors.surface};
    color: \${({ theme }) => theme.colors.text};
  }
\`;

// In root:
// <ThemeProvider theme={theme}>
//   <GlobalStyles />
//   <App />
// </ThemeProvider>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Styling 3rd-party components */}
            <Styled.Section>
                <Styled.H2>Styling 3rd-Party Components</Styled.H2>
                <Styled.Pre>
                    {`import Select from "react-select";
import styled from "styled-components";

const StyledSelect = styled(Select)\`
  .react-select__control {
    border-radius: 12px;
    background: #121316;
  }
\`;`}
                </Styled.Pre>
                <Styled.Small>
                    Inspect the library’s DOM to target proper class names, or prefer libraries exposing style
                    APIs.
                </Styled.Small>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Do</b> keep tokens in the theme (<Styled.InlineCode>colors</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>space</Styled.InlineCode>, <Styled.InlineCode>radius</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Do</b> use <b>transient props</b> (<Styled.InlineCode>$variant</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>$size</Styled.InlineCode>) to avoid React DOM warnings.
                    </li>
                    <li>
                        <b>Do</b> create <b>base primitives</b> (Button, Card, Input) and extend them across the
                        app.
                    </li>
                    <li>
                        <b>Don’t</b> create styled components <i>inside</i> render—define them once at module scope.
                    </li>
                    <li>
                        <b>Don’t</b> overuse global styles; prefer local, component-scoped styles.
                    </li>
                    <li>
                        <b>Don’t</b> mix ad-hoc inline styles and styled-components for the same element without a
                        reason—prefer one source of truth.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Transient props:</b> props prefixed with <Styled.InlineCode>$</Styled.InlineCode> that
                        styled-components strips from the DOM.
                    </li>
                    <li>
                        <b><code>css</code> helper:</b> lets you build reusable style blocks or variant maps.
                    </li>
                    <li>
                        <b>Theme:</b> shared design tokens available via{" "}
                        <Styled.InlineCode>ThemeProvider</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Polymorphic <code>as</code>:</b> render the same styles as a different semantic tag.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use <i>styled-components</i> to co-locate real CSS with your React components, driven
                by a theme and transient props. Build a small set of base primitives, add variants with{" "}
                <code>css</code>, and keep most styles component-scoped for clarity and reuse.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default StyledComponents;
