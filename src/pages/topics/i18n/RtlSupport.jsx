import { Styled } from "./styled";

const RtlSupport = () => {
    return (
        <Styled.Page>
            <Styled.Title>RTL Support (Right-to-Left)</Styled.Title>

            <Styled.Lead>
                <b>RTL</b> (right-to-left) languages like Arabic, Hebrew, and Persian are written and read
                from right to left. Good RTL support means your UI <i>and</i> content adapt without hacks.
                This page explains the concepts and shows safe, production-ready patterns.
            </Styled.Lead>

            {/* 1) Key definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>LTR / RTL:</b> <i>Left-to-right</i> vs <i>right-to-left</i> text direction. English/Hindi are LTR; Arabic/Hebrew are RTL.
                    </li>
                    <li>
                        <b>dir attribute:</b> HTML attribute that controls direction. Common values:{" "}
                        <Styled.InlineCode>ltr</Styled.InlineCode>, <Styled.InlineCode>rtl</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>auto</Styled.InlineCode>. Example:{" "}
                        <Styled.InlineCode>{`<html dir="rtl" lang="ar">`}</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Bidi (bi-directional) text:</b> Text containing both RTL and LTR segments (e.g., Arabic sentence with an English product code).
                        Browsers apply the <i>Unicode Bidirectional Algorithm</i> to order characters correctly.
                    </li>
                    <li>
                        <b>Scripts:</b> Writing systems (Latin, Arabic, Hebrew). Some scripts require{" "}
                        <b>glyph shaping</b> (context-dependent character forms), handled by the font engine.
                    </li>
                    <li>
                        <b>Mirroring:</b> Certain symbols (e.g., parentheses, arrows) visually mirror in RTL contexts.
                        UI icons may also need <i>manual</i> mirroring (e.g., chevrons).
                    </li>
                    <li>
                        <b>Logical properties:</b> CSS properties that reference <i>inline/block</i> flow
                        instead of physical <i>left/right/top/bottom</i>. They automatically adapt in RTL.
                        Example: <Styled.InlineCode>margin-inline-start</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Enabling RTL */}
            <Styled.Section>
                <Styled.H2>Enable RTL at the Right Level</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Document-wide:</b> set once on <Styled.InlineCode>&lt;html&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>App/Container-only:</b> set <Styled.InlineCode>dir</Styled.InlineCode> on the app root when you need per-app control inside a larger page.
                    </li>
                    <li>
                        <b>Per-component:</b> only for special cases (e.g., an embedded RTL widget inside an LTR page).
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Document-wide (index.html)
// <html dir="rtl" lang="ar"> ... </html>

// App-level (React)
function AppRoot({ dir = "ltr", lang = "en" }) {
  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("dir", dir);    // "rtl" or "ltr"
    html.setAttribute("lang", lang);  // e.g., "ar", "he", "en"
  }, [dir, lang]);

  return <div id="app">{/* ... */}</div>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Prefer setting <Styled.InlineCode>dir</Styled.InlineCode> on{" "}
                    <Styled.InlineCode>&lt;html&gt;</Styled.InlineCode> (or a single high-level container) to avoid
                    conflicting nested directions.
                </Styled.Small>
            </Styled.Section>

            {/* 3) CSS logical properties */}
            <Styled.Section>
                <Styled.H2>Use CSS Logical Properties (Avoid left/right)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Inline vs Block:</b> <i>Inline</i> flows horizontally (start→end), <i>Block</i> vertically (before→after).
                        In RTL, inline start is the right side; in LTR, it's the left side.
                    </li>
                    <li>
                        Replace <Styled.InlineCode>margin-left/right</Styled.InlineCode> with{" "}
                        <Styled.InlineCode>margin-inline-start/end</Styled.InlineCode>.
                    </li>
                    <li>
                        Replace <Styled.InlineCode>padding-left/right</Styled.InlineCode> with{" "}
                        <Styled.InlineCode>padding-inline-start/end</Styled.InlineCode>.
                    </li>
                    <li>
                        Replace <Styled.InlineCode>left/right</Styled.InlineCode> (positioning) with{" "}
                        <Styled.InlineCode>inset-inline-start/end</Styled.InlineCode>.
                    </li>
                    <li>
                        Borders & radius: use <Styled.InlineCode>border-inline-start</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>border-inline-end</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>border-start-start-radius</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>border-start-end-radius</Styled.InlineCode>, etc.
                    </li>
                    <li>
                        Text alignment: use <Styled.InlineCode>text-align: start | end</Styled.InlineCode> instead of left/right.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`/* BAD: breaks in RTL */
.card {
  padding-left: 16px;
  border-left: 4px solid var(--accent);
}

/* GOOD: adapts automatically */
.card {
  padding-inline-start: 16px;
  border-inline-start: 4px solid var(--accent);
}

/* Positioning */
.badge {
  position: absolute;
  right: 8px; /* BAD */
}
.badge {
  position: absolute;
  inset-inline-end: 8px; /* GOOD */
}

/* Text */
.title { text-align: start; } /* start -> left in LTR, right in RTL */`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Icons and chevrons */}
            <Styled.Section>
                <Styled.H2>Icons, Arrows, and Chevrons</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Semantics over shape:</b> name icons by meaning (<i>previous / next</i>) not by side (<i>left / right</i>).
                    </li>
                    <li>
                        <b>Auto-mirror:</b> flip with CSS under RTL, or swap the icon component.
                    </li>
                    <li>
                        <b>Do not</b> mirror numerals or text icons; only direction-dependent symbols.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`/* CSS auto flip based on direction */
[dir="rtl"] .chevron { transform: scaleX(-1); }
[dir="ltr"] .chevron { transform: none; }

/* React swap by direction */
function Chevron({ dir = document?.documentElement?.dir || "ltr" }) {
  return dir === "rtl" ? <span aria-hidden>›</span> : <span aria-hidden>‹</span>;
}

// Usage in nav buttons:
function Pager({ dir }) {
  return (
    <div className="pager">
      <button><Chevron dir={dir} /> <span>Previous</span></button>
      <button><span>Next</span> <Chevron dir={dir} /></button>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Forms, inputs, numbers */}
            <Styled.Section>
                <Styled.H2>Forms & Inputs</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>text-align: start</Styled.InlineCode> for inputs to align with the reading direction.
                    </li>
                    <li>
                        For codes/IDs/URLs inside RTL UIs, wrap in <Styled.InlineCode>&lt;bdi&gt;</Styled.InlineCode> to isolate direction.
                    </li>
                    <li>
                        Use <Styled.InlineCode>dir="auto"</Styled.InlineCode> for user-generated content so the browser chooses direction per string.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Mixed content isolation
<p>
  Order ID: <bdi>AB-42-X1</bdi>
</p>

// Input aligned to direction
input[type="text"] { text-align: start; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Content isolation & overrides */}
            <Styled.Section>
                <Styled.H2>Mixed Direction Content: Isolate or Override</Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>&lt;bdi&gt;</Styled.InlineCode> (Bi-Directional Isolation): isolates a span so surrounding text doesn't reorder it.
                    </li>
                    <li>
                        <Styled.InlineCode>&lt;bdo dir="rtl|ltr"&gt;</Styled.InlineCode> (Bi-Directional Override): forces a direction for that span.
                    </li>
                    <li>
                        CSS <Styled.InlineCode>direction</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>unicode-bidi</Styled.InlineCode> can force/override direction, but prefer semantic HTML first.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example: force a LTR code snippet inside an RTL paragraph
<p dir="rtl">
  لتثبيت الحزمة، شغّل:
  <bdo dir="ltr"><code>npm install my-lib</code></bdo>
</p>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Integration with i18n libraries */}
            <Styled.Section>
                <Styled.H2>Hooking Direction to Locale</Styled.H2>
                <Styled.List>
                    <li>
                        When a user switches language, update <Styled.InlineCode>dir</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>lang</Styled.InlineCode> on <Styled.InlineCode>&lt;html&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        Many i18n libs expose a <Styled.InlineCode>dir()</Styled.InlineCode> helper that returns{" "}
                        <Styled.InlineCode>"rtl"</Styled.InlineCode> or <Styled.InlineCode>"ltr"</Styled.InlineCode>.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example with an i18n manager exposing dir() and language
function useHtmlDirection(i18n) {
  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("dir", i18n.dir());       // "rtl" or "ltr"
    html.setAttribute("lang", i18n.language);   // e.g., "ar"
  }, [i18n]);
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Performance & layout tips */}
            <Styled.Section>
                <Styled.H2>Layout Tips & Performance</Styled.H2>
                <Styled.List>
                    <li>
                        Prefer logical properties over flipping entire layouts with{" "}
                        <Styled.InlineCode>flex-direction: row-reverse</Styled.InlineCode>. Use reverse only when truly needed.
                    </li>
                    <li>
                        Grids work great with logical gaps and <Styled.InlineCode>justify-content</Styled.InlineCode> values; avoid hardcoded left/right offsets.
                    </li>
                    <li>
                        Carousels/steppers: base “previous/next” on <i>start/end</i> semantics, not left/right.
                    </li>
                    <li>
                        Avoid setting <Styled.InlineCode>direction: rtl</Styled.InlineCode> on scroll containers just to “flip” scrolling; it can invert wheel/keyboard behavior unexpectedly.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> set <Styled.InlineCode>dir</Styled.InlineCode> on <Styled.InlineCode>&lt;html&gt;</Styled.InlineCode> (or one app root) when switching locales.</li>
                    <li><b>Do</b> use CSS logical properties and <Styled.InlineCode>text-align: start|end</Styled.InlineCode>.</li>
                    <li><b>Do</b> isolate mixed text with <Styled.InlineCode>&lt;bdi&gt;</Styled.InlineCode> and use <Styled.InlineCode>dir="auto"</Styled.InlineCode> for user content.</li>
                    <li><b>Don't</b> hardcode left/right offsets, paddings, borders, or icon directions.</li>
                    <li><b>Don't</b> rely on global <Styled.InlineCode>row-reverse</Styled.InlineCode> to “make things RTL”. Fix styles at the property level.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>dir:</b> HTML attribute that sets direction for an element's descendants.</li>
                    <li><b>lang:</b> Language tag used for fonts, spellcheck, screen readers, hyphenation.</li>
                    <li><b>Inline start/end:</b> Logical left/right depending on direction (start = left in LTR, right in RTL).</li>
                    <li><b>Block start/end:</b> Logical top/bottom following writing mode (usually top/bottom).</li>
                    <li><b>bdi / bdo:</b> Elements for isolating or overriding bidirectional text behavior.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Set <b>dir</b> at the document or app root, adopt <b>CSS logical properties</b>, mirror icons
                by direction, and isolate mixed-direction text. These patterns keep your UI correct and maintainable in both LTR and RTL.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default RtlSupport;
