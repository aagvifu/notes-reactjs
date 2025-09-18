import React from "react";
import { Styled } from "./styled";

const SanitizeHtml = () => {
    return (
        <Styled.Page>
            <Styled.Title>Sanitize HTML</Styled.Title>

            <Styled.Lead>
                <b>Sanitizing HTML</b> means taking <i>untrusted HTML</i> and transforming it into a
                <b> safe subset</b> by <em>removing or fixing</em> dangerous tags, attributes, and URLs.
                React <b>escapes text by default</b>, so plain strings are safe. Sanitization is only needed
                when you must render HTML with <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode>
                (e.g., CMS content, Markdown output).
            </Styled.Lead>

            {/* 1) Why sanitize? */}
            <Styled.Section>
                <Styled.H2>Why sanitize? (XSS threat)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>XSS (Cross-Site Scripting):</b> an attacker injects script into a page so it runs in
                        the victim's browser. Types include:
                        <ul>
                            <li><b>Stored XSS:</b> malicious content saved on the server (e.g., comments).</li>
                            <li><b>Reflected XSS:</b> payload bounces off a request (e.g., query param).</li>
                            <li><b>DOM-based XSS:</b> injection via client-side JS manipulating the DOM.</li>
                        </ul>
                    </li>
                    <li>
                        <b>Untrusted HTML:</b> any HTML you didn't generate yourself (user input, third-party,
                        CMS, Markdown-to-HTML output).
                    </li>
                    <li>
                        <b>Goal of sanitization:</b> allow only a minimal, known-good (allowlist) set of tags,
                        attributes, and URL schemes.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) React defaults */}
            <Styled.Section>
                <Styled.H2>React defaults: text is safe, raw HTML is not</Styled.H2>
                <Styled.Pre>
                    {`function SafeText({ userText }) {
  // React auto-escapes: "<img onerror=...>" will be rendered as text, not executed.
  return <p>{userText}</p>;
}

function UnsafeHtml({ html }) {
  // Risky if 'html' is untrusted. Only do this with sanitized HTML.
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Rule:</b> Prefer rendering text. Only use{" "}
                    <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode> with sanitized content.
                </Styled.Small>
            </Styled.Section>

            {/* 3) What makes HTML dangerous? */}
            <Styled.Section>
                <Styled.H2>What makes HTML dangerous?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Inline handlers:</b> <Styled.InlineCode>onclick</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>onerror</Styled.InlineCode>, etc.
                    </li>
                    <li>
                        <b>Dangerous URLs:</b> <Styled.InlineCode>javascript:</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>data:</Styled.InlineCode> in{" "}
                        <Styled.InlineCode>href/src</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Executable contexts:</b> <Styled.InlineCode>&lt;script&gt;</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>&lt;iframe&gt;</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>&lt;style&gt;</Styled.InlineCode> with harmful CSS,{" "}
                        <Styled.InlineCode>&lt;svg&gt;</Styled.InlineCode> with event handlers.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Common XSS payloads (do NOT render these without sanitization)
<a href="javascript:alert(1)">Click</a>
<img src=x onerror="alert(1)">
<svg onload="alert(1)"></svg>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Allowlist vs blocklist */}
            <Styled.Section>
                <Styled.H2>Allowlist vs Blocklist</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Allowlist (recommended):</b> explicitly permit safe tags/attributes; remove
                        everything else.
                    </li>
                    <li>
                        <b>Blocklist (unsafe):</b> trying to list all bad things is brittle—new vectors appear.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Library options */}
            <Styled.Section>
                <Styled.H2>Libraries: <code>sanitize-html</code> (Node/SSR) &amp; DOMPurify (browser)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>sanitize-html:</b> popular for Node/SSR and also usable in the browser; highly
                        configurable allowlists and URL scheme checks.
                    </li>
                    <li>
                        <b>DOMPurify:</b> small, fast client-side sanitizer that integrates well in the browser.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Example with sanitize-html */}
            <Styled.Section>
                <Styled.H2>Example: <code>sanitize-html</code> configuration</Styled.H2>
                <Styled.Pre>
                    {`import sanitizeHtml from "sanitize-html";

const config = {
  allowedTags: [
    "b","i","em","strong","a","p","br","ul","ol","li","code","pre","blockquote"
  ],
  allowedAttributes: {
    a: ["href","name","target","rel"],
    "*": ["title"]
  },
  // Only allow safe URL schemes
  allowedSchemes: ["http","https","mailto","tel"],
  // Optional: restrict iframe hosts if you allow iframes
  allowedIframeHostnames: ["www.youtube.com","player.vimeo.com"],
  transformTags: {
    // Enforce safe anchor behavior
    "a": sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" })
  },
  // Disallow style and event handlers entirely
  disallowedTagsMode: "discard"
};

export function toSafeHtml(untrustedHtml) {
  return sanitizeHtml(untrustedHtml, config);
}

// Usage in a component:
function Article({ htmlFromCMS }) {
  const clean = toSafeHtml(htmlFromCMS);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> keep the allowlist minimal. Add tags only when truly needed.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Example with DOMPurify */}
            <Styled.Section>
                <Styled.H2>Example: DOMPurify (browser-side)</Styled.H2>
                <Styled.Pre>
                    {`import DOMPurify from "dompurify";

function SafeBlock({ html }) {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },     // base safe HTML profile
    ALLOWED_URI_REGEXP: /^(https?:|mailto:|tel:)/i
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    DOMPurify strips event handlers and dangerous URLs. You can extend allowlists if needed.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Markdown pipeline */}
            <Styled.Section>
                <Styled.H2>Markdown → HTML → Sanitize</Styled.H2>
                <Styled.List>
                    <li>
                        If you convert Markdown to HTML (remark/rehype/marked), <b>still sanitize</b> the output.
                    </li>
                    <li>
                        Prefer a <b>strict allowlist</b> (e.g., text formatting, lists, code) and ban raw HTML in
                        Markdown if possible.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pseudo-pipeline
const html = markdownToHtml(userMarkdown);
const safe = sanitizeHtml(html, config);
render(<div dangerouslySetInnerHTML={{ __html: safe }} />);`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) URLs & iframes */}
            <Styled.Section>
                <Styled.H2>URLs, Iframes, and Schemes</Styled.H2>
                <Styled.List>
                    <li>
                        Only allow <b>http</b>, <b>https</b>, <b>mailto</b>, <b>tel</b>. Reject{" "}
                        <Styled.InlineCode>javascript:</Styled.InlineCode> and unrestricted{" "}
                        <Styled.InlineCode>data:</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Iframes:</b> avoid if you can. If necessary, allow only specific hostnames and apply{" "}
                        <Styled.InlineCode>sandbox</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>allow</Styled.InlineCode> attributes.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: allowing only YouTube embeds (sanitize-html)
const config = {
  allowedTags: ["iframe"],
  allowedAttributes: { iframe: ["src","width","height","allow","allowfullscreen","frameborder"] },
  allowedIframeHostnames: ["www.youtube.com"]
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) CSS & style attributes */}
            <Styled.Section>
                <Styled.H2>CSS risks & style attributes</Styled.H2>
                <Styled.List>
                    <li>
                        Avoid <b>inline styles</b> in untrusted HTML. Some CSS can aid data exfiltration or UI
                        redress attacks.
                    </li>
                    <li>
                        Strip <Styled.InlineCode>style</Styled.InlineCode> attributes (default in strict configs).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Security layers around sanitization */}
            <Styled.Section>
                <Styled.H2>Defense in Depth</Styled.H2>
                <Styled.List>
                    <li>
                        <b>CSP (Content-Security-Policy):</b> an HTTP header that restricts where scripts/styles
                        can load from and can disallow <Styled.InlineCode>unsafe-inline</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Trusted Types:</b> a browser policy that forces you to create HTML via vetted
                        functions, preventing DOM XSS sinks (where supported).
                    </li>
                    <li>
                        <b>Escape everywhere else:</b> for attributes, URLs, and text—escape/encode appropriately
                        even if you sanitize.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Testing your sanitizer */}
            <Styled.Section>
                <Styled.H2>Testing & QA</Styled.H2>
                <Styled.List>
                    <li>Fuzz with known payloads (<Styled.InlineCode>&lt;img onerror&gt;</Styled.InlineCode>, <Styled.InlineCode>javascript:</Styled.InlineCode> links, SVG).</li>
                    <li>Snapshot sanitized output for representative inputs.</li>
                    <li>Pin library versions and review changelogs for security fixes.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep an allowlist small; add only necessary tags/attributes.</li>
                    <li><b>Do</b> sanitize on the server (SSR) and/or at render time (client) depending on flow.</li>
                    <li><b>Do</b> use CSP + Trusted Types where possible for extra protection.</li>
                    <li><b>Don't</b> render untrusted HTML as raw; never trust user input.</li>
                    <li><b>Don't</b> rely on a blocklist or regex to “filter XSS.” Use a real sanitizer.</li>
                </Styled.List>
            </Styled.Section>

            {/* 14) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Sanitization:</b> structurally removing/rewriting unsafe HTML parts to a safe subset.</li>
                    <li><b>Allowlist:</b> only the explicitly permitted items are allowed; best practice.</li>
                    <li><b>Scheme:</b> the protocol of a URL (e.g., <i>https</i>, <i>mailto</i>).</li>
                    <li><b>CSP:</b> HTTP policy that limits resource loading and script execution.</li>
                    <li><b>Trusted Types:</b> browser feature that blocks unsafe DOM sinks unless vetted.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> Render text by default. If you must render HTML, sanitize with a strict
                allowlist using <i>sanitize-html</i> (Node/SSR) or DOMPurify (browser), lock down URLs and
                iframes, and add CSP/Trusted Types for defense in depth.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SanitizeHtml;
