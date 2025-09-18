import React from "react";
import { Styled } from "./styled";

const Responsive = () => {
    return (
        <Styled.Page>
            <Styled.Title>Responsive Design</Styled.Title>

            <Styled.Lead>
                <b>Responsive design</b> means your UI <i>adapts fluidly</i> to different screen sizes,
                orientations, and input types—without breaking layout, readability, or usability.
                Core ideas: <b>mobile-first</b>, <b>fluid layouts</b>, sensible <b>breakpoints</b>, and
                <b>progressive enhancement</b>.
            </Styled.Lead>

            {/* 1) What & why */}
            <Styled.Section>
                <Styled.H2>What &amp; Why</Styled.H2>
                <Styled.List>
                    <li><b>Responsive</b>: layout/content reflow to fit any viewport (phone → ultra-wide).</li>
                    <li><b>Mobile-first</b>: start with a solid small-screen layout, then enhance for larger screens via <Styled.InlineCode>@media (min-width: ...)</Styled.InlineCode>.</li>
                    <li><b>Fluid</b>: avoid rigid pixels; prefer percentages, <Styled.InlineCode>rem</Styled.InlineCode>, and <Styled.InlineCode>vw/vh</Styled.InlineCode>.</li>
                    <li><b>Breakpoint</b>: the viewport width where layout changes meaningfully (content-driven, not device-driven).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Viewport meta */}
            <Styled.Section>
                <Styled.H2>Viewport Meta (index.html)</Styled.H2>
                <Styled.Small>
                    Ensure this exists once in <Styled.InlineCode>index.html</Styled.InlineCode> so CSS pixels map to device pixels correctly.
                </Styled.Small>
                <Styled.Pre>
                    {`<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1" />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Units & fluid scales */}
            <Styled.Section>
                <Styled.H2>Units &amp; Fluid Scales</Styled.H2>
                <Styled.List>
                    <li><b>Typography:</b> base on <Styled.InlineCode>rem</Styled.InlineCode> so users’ OS zoom/accessibility settings scale text.</li>
                    <li><b>Layout:</b> use percentages and <Styled.InlineCode>min()</Styled.InlineCode>/<Styled.InlineCode>max()</Styled.InlineCode>/<Styled.InlineCode>clamp()</Styled.InlineCode> for fluid constraints.</li>
                    <li><b>Viewport units:</b> <Styled.InlineCode>vw</Styled.InlineCode>/<Styled.InlineCode>vh</Styled.InlineCode> for large sections; consider dynamic units <Styled.InlineCode>dvh</Styled.InlineCode>/<Styled.InlineCode>dvw</Styled.InlineCode> to avoid mobile URL bar issues.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Fluid type scale with bounds */
:root { --step-0: clamp(14px, 0.9rem + 0.2vw, 16px); }
h1 { font-size: clamp(1.8rem, 1.2rem + 2vw, 3rem); }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Breakpoints (content-first) */}
            <Styled.Section>
                <Styled.H2>Breakpoints (Content-First)</Styled.H2>
                <Styled.List>
                    <li>Choose breakpoints where your layout <i>needs</i> to change (e.g., cards wrap from 1 → 2 → 3 columns).</li>
                    <li>Prefer <Styled.InlineCode>min-width</Styled.InlineCode> queries (mobile-first).</li>
                    <li>Keep the set small and meaningful (e.g., 480, 768, 1024, 1280).</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Mobile-first media queries */
.container { padding: 16px; max-width: 720px; margin: 0 auto; }
@media (min-width: 768px)  { .container { max-width: 960px; } }
@media (min-width: 1024px) { .container { max-width: 1120px; } }
@media (min-width: 1280px) { .container { max-width: 1280px; } }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Layout patterns: Flex & Grid */}
            <Styled.Section>
                <Styled.H2>Layout Patterns: Flex &amp; Grid</Styled.H2>
                <Styled.List>
                    <li><b>Flexbox</b> for 1-D alignment (rows/columns, nav bars, toolbars).</li>
                    <li><b>Grid</b> for 2-D layouts; <Styled.InlineCode>auto-fit</Styled.InlineCode> + <Styled.InlineCode>minmax</Styled.InlineCode> gives magic responsive cards.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Responsive card grid (no explicit breakpoints) */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}`}
                </Styled.Pre>
                <Styled.Small>
                    This grid expands from 1 column on mobile to as many columns as fit the container.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Styled-components examples */}
            <Styled.Section>
                <Styled.H2>styled-components Examples</Styled.H2>
                <Styled.Pre>
                    {`// tokens.js
export const bp = { sm: 480, md: 768, lg: 1024, xl: 1280 };

// Component.styled.js
import styled from "styled-components";
import { bp } from "../tokens";

export const Wrapper = styled.div\`
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;

  @media (min-width: \${bp.md}px)  { max-width: 960px; }
  @media (min-width: \${bp.lg}px)  { max-width: 1120px; }
  @media (min-width: \${bp.xl}px)  { max-width: 1280px; }
\`;

export const Cards = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
\`;

export const Hero = styled.section\`
  min-height: 60dvh;
  display: grid;
  place-items: center;
  padding: clamp(24px, 4vw, 64px);
\`;`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Images & media */}
            <Styled.Section>
                <Styled.H2>Images &amp; Media</Styled.H2>
                <Styled.List>
                    <li>Make media flexible: <Styled.InlineCode>img, video {`{ max-width: 100%; height: auto; }`}</Styled.InlineCode>.</li>
                    <li>Use <Styled.InlineCode>srcset</Styled.InlineCode> + <Styled.InlineCode>sizes</Styled.InlineCode> to send the right resolution; add <Styled.InlineCode>loading="lazy"</Styled.InlineCode> for below-the-fold.</li>
                    <li>Contain or cover using <Styled.InlineCode>object-fit</Styled.InlineCode> to preserve aspect ratios.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<img
  src="hero-800.jpg"
  srcSet="hero-480.jpg 480w, hero-800.jpg 800w, hero-1280.jpg 1280w"
  sizes="(min-width: 1024px) 960px, 100vw"
  alt="Product screenshot"
  loading="lazy"
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Navigation & touch targets */}
            <Styled.Section>
                <Styled.H2>Nav &amp; Touch Targets</Styled.H2>
                <Styled.List>
                    <li>Minimum target size ~44×44px (or equivalent in <Styled.InlineCode>rem</Styled.InlineCode>).</li>
                    <li>Use <Styled.InlineCode>@media (hover: none)</Styled.InlineCode> / <Styled.InlineCode>(pointer: coarse)</Styled.InlineCode> to adjust hover-only UI for touch devices.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Hover alternatives for touch */
@media (hover: none) {
  .nav .menu:hover .dropdown { /* don't rely on hover */ }
  .nav .menu .dropdown { /* show via click/tap JS or always visible */ }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Motion & accessibility */}
            <Styled.Section>
                <Styled.H2>Motion &amp; Accessibility</Styled.H2>
                <Styled.List>
                    <li>Respect users who prefer less motion: <Styled.InlineCode>@media (prefers-reduced-motion: reduce)</Styled.InlineCode>.</li>
                    <li>Prevent layout shift (CLS): reserve space for images/media; avoid late font swaps, or use font loading strategies.</li>
                </Styled.List>
                <Styled.Pre>
                    {`@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Tables & overflow */}
            <Styled.Section>
                <Styled.H2>Tables &amp; Overflow</Styled.H2>
                <Styled.List>
                    <li>Allow horizontal scrolling on small screens; add sticky headers if needed.</li>
                    <li>Alternative: convert rows into card blocks on narrow viewports.</li>
                </Styled.List>
                <Styled.Pre>
                    {`.table-wrap { overflow-x: auto; }
table { border-collapse: collapse; min-width: 640px; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> start mobile-first; scale up with <Styled.InlineCode>min-width</Styled.InlineCode> queries.</li>
                    <li><b>Do</b> use fluid containers and a small, consistent breakpoint set.</li>
                    <li><b>Do</b> test on real devices and DevTools device emulation.</li>
                    <li><b>Don’t</b> hardcode fixed widths everywhere or rely solely on pixels.</li>
                    <li><b>Don’t</b> hide content on small screens if it’s core; reflow or stack it.</li>
                    <li><b>Don’t</b> make hover-only interactions without touch alternatives.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Breakpoint</b>: viewport width where layout rules change.</li>
                    <li><b>Mobile-first</b>: default styles target small screens; larger screens add enhancements.</li>
                    <li><b>Fluid</b>: sizes scale with container/viewport; opposite of rigid fixed layouts.</li>
                    <li><b>Container query</b>: style based on <i>container</i> width (covered in the next topic).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: design small → scale up, use fluid sizes, keep breakpoints meaningful, and ensure
                accessible interactions across touch, mouse, and keyboard.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Responsive;
