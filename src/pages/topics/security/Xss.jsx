import React from "react";
import { Styled } from "./styled";

const Xss = () => {
    return (
        <Styled.Page>
            <Styled.Title>XSS - Cross-Site Scripting</Styled.Title>

            <Styled.Lead>
                <b>Cross-Site Scripting (XSS)</b> is a vulnerability where an attacker injects
                <b> untrusted content</b> (often JavaScript) into a page so that it runs in the victim's browser
                under your site's origin. XSS lets attackers steal data (tokens, cookies), perform actions as
                the user, deface UI, or pivot to other attacks.
            </Styled.Lead>

            {/* 1) What, why, threat model */}
            <Styled.Section>
                <Styled.H2>Definition & Threat Model</Styled.H2>
                <Styled.List>
                    <li><b>XSS:</b> Executing attacker-controlled script in the context of your web origin.</li>
                    <li><b>Untrusted input:</b> Any data you don't fully control (user input, query params, URL hash, CMS fields, third-party APIs).</li>
                    <li><b>Payload:</b> The injected content (e.g., <Styled.InlineCode>&lt;img onerror=...&gt;</Styled.InlineCode>, <Styled.InlineCode>&lt;script&gt;</Styled.InlineCode>, <Styled.InlineCode>javascript:</Styled.InlineCode> URLs).</li>
                    <li><b>Sink:</b> A place where that untrusted input is inserted into the DOM/HTML/JS (e.g., <Styled.InlineCode>innerHTML</Styled.InlineCode>, <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode>, <Styled.InlineCode>href</Styled.InlineCode>, inline event handlers).</li>
                    <li><b>Impact:</b> Token/cookie theft, account takeover, fake forms, keylogging, CSRF bypass helpers, browser exploit delivery.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Types of XSS */}
            <Styled.Section>
                <Styled.H2>Types of XSS (with examples)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Reflected XSS:</b> Payload comes from the request (URL/query) and is reflected into the response/DOM immediately.
                        <Styled.Pre>
                            {`// Example (anti-pattern): reading query and injecting directly
const params = new URLSearchParams(window.location.search);
const q = params.get("q"); // attacker controls
<div dangerouslySetInnerHTML={{ __html: q }} /> // ❌ reflected XSS`}
                        </Styled.Pre>
                    </li>
                    <li>
                        <b>Stored XSS:</b> Payload is persisted (DB/CMS/comment) and served to every viewer later.
                        <Styled.Small>Most damaging because it hits many users without them clicking anything.</Styled.Small>
                    </li>
                    <li>
                        <b>DOM-based XSS:</b> Client-side JS reads an untrusted value and writes it into a dangerous sink at runtime (no server needed).
                        <Styled.Pre>
                            {`// Example (anti-pattern): using hash as HTML
const raw = decodeURIComponent(window.location.hash.slice(1));
document.getElementById("slot").innerHTML = raw; // ❌ DOM XSS`}
                        </Styled.Pre>
                    </li>
                    <li>
                        <b>Self-XSS:</b> Social-engineering trick where users paste code into DevTools. Still dangerous for your users; educate and prevent.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) How React helps (and where it doesn't) */}
            <Styled.Section>
                <Styled.H2>How React Helps - and Where It Doesn't</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Auto-escaping:</b> React escapes text interpolations, so{" "}
                        <Styled.InlineCode>{`<div>{userInput}</div>`}</Styled.InlineCode> renders as text, not HTML.
                    </li>
                    <li>
                        <b>Danger zones:</b> <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode>, direct DOM APIs (<Styled.InlineCode>innerHTML</Styled.InlineCode>),
                        and setting sensitive attributes (<Styled.InlineCode>href</Styled.InlineCode>, <Styled.InlineCode>src</Styled.InlineCode>) with untrusted data.
                    </li>
                    <li>
                        <b>Event props:</b> React props like <Styled.InlineCode>onClick</Styled.InlineCode> are functions; strings there don't get executed. But
                        if you generate HTML strings with inline handlers (e.g., <Styled.InlineCode>&lt;div onclick="..."&gt;</Styled.InlineCode>) and inject them as HTML, they can run.
                    </li>
                    <li>
                        <b>URLs still risky:</b> If you do <Styled.InlineCode>{`<a href={userHref}>`}</Styled.InlineCode>, React sets the attribute. You must validate and
                        disallow <Styled.InlineCode>javascript:</Styled.InlineCode>, <Styled.InlineCode>data:text/html</Styled.InlineCode>, etc.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Vulnerable vs safe patterns */}
            <Styled.Section>
                <Styled.H2>Vulnerable vs Safe Patterns</Styled.H2>

                <Styled.H3>❌ Vulnerable: injecting untrusted HTML</Styled.H3>
                <Styled.Pre>
                    {`// DO NOT: render untrusted HTML
function Bio({ aboutHtml }) {
  return <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />; // ❌
}`}
                </Styled.Pre>

                <Styled.H3>✅ Safe: render as text (preferred)</Styled.H3>
                <Styled.Pre>
                    {`function Bio({ aboutText }) {
  return <p>{aboutText}</p>; // React escapes text safely
}`}
                </Styled.Pre>

                <Styled.H3>✅ If you MUST render HTML, sanitize first</Styled.H3>
                <Styled.Small>Use a robust sanitizer. On the client, a common choice is DOMPurify; on the server, libraries like <i>sanitize-html</i>.</Styled.Small>
                <Styled.Pre>
                    {`// Example idea (client): sanitize then set
import DOMPurify from "dompurify";
function SafeHtml({ html }) {
  const clean = React.useMemo(() => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }), [html]);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}`}
                </Styled.Pre>

                <Styled.H3>✅ Validate URLs before using them</Styled.H3>
                <Styled.Pre>
                    {`function isSafeHttpUrl(u) {
  try {
    const url = new URL(u, window.location.origin);
    const scheme = url.protocol.toLowerCase();
    return scheme === "http:" || scheme === "https:";
  } catch { return false; }
}

function SafeLink({ href, children }) {
  const safe = isSafeHttpUrl(href) ? href : "#";
  return <a href={safe} rel="noopener noreferrer">{children}</a>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Defense in depth */}
            <Styled.Section>
                <Styled.H2>Defense in Depth</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Sanitization:</b> Strip/neutralize dangerous HTML (tags/attrs) before display. Do it as close to the source as possible
                        (server/CMS) and again at the edge if needed.
                    </li>
                    <li>
                        <b>Context-aware encoding:</b> Escape differently for contexts - HTML text, HTML attribute, URL, JS string, CSS.
                    </li>
                    <li>
                        <b>Content Security Policy (CSP):</b> HTTP header that limits where scripts come from. Disallow inline scripts to massively reduce XSS blast radius.
                        <Styled.Pre>
                            {`// Example CSP (strict baseline)
// Content-Security-Policy:
default-src 'self';
script-src 'self'; object-src 'none';
base-uri 'none'; frame-ancestors 'none';
img-src 'self' data: https:;
style-src 'self' 'unsafe-inline'; /* better: use nonces */
upgrade-insecure-requests;`}
                        </Styled.Pre>
                    </li>
                    <li>
                        <b>Trusted Types:</b> Browser feature forcing dangerous sinks to accept only vetted values. Great with frameworks and CSP.
                    </li>
                    <li>
                        <b>Cookie hardening:</b> Use <Styled.InlineCode>HttpOnly</Styled.InlineCode> (not readable by JS), <Styled.InlineCode>Secure</Styled.InlineCode>, and <Styled.InlineCode>SameSite</Styled.InlineCode>.
                        Reduces XSS token theft impact and helps with CSRF.
                    </li>
                    <li>
                        <b>Token placement:</b> Prefer server-set <Styled.InlineCode>HttpOnly</Styled.InlineCode> cookies over storing secrets in <Styled.InlineCode>localStorage</Styled.InlineCode>.
                        If XSS happens, <Styled.InlineCode>localStorage</Styled.InlineCode> tokens are trivial to steal.
                    </li>
                    <li>
                        <b>Avoid inline JS/HTML building:</b> No string-concatenated HTML; no inline event handlers; no unsanitized markdown to HTML.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Testing XSS safely */}
            <Styled.Section>
                <Styled.H2>Testing & Finding XSS (safely)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Probe payloads:</b> Try harmless markers like <Styled.InlineCode>{`"><svg onload=alert(1)>`}</Styled.InlineCode> in fields that might render as HTML.
                        If an alert pops, there's likely an XSS sink. Use a throwaway environment.
                    </li>
                    <li>
                        <b>URL tests:</b> Ensure <Styled.InlineCode>javascript:</Styled.InlineCode> links are blocked; test <Styled.InlineCode>data:text/html,</Styled.InlineCode> and malformed schemes.
                    </li>
                    <li>
                        <b>Automate:</b> Add linters/SAST/DAST and review any usage of <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode> or direct DOM writes.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> treat all external data as untrusted and validate early.</li>
                    <li><b>Do</b> render untrusted content as text; sanitize if you must render HTML.</li>
                    <li><b>Do</b> set a strict CSP and consider Trusted Types.</li>
                    <li><b>Don't</b> store tokens in <Styled.InlineCode>localStorage</Styled.InlineCode>; prefer <Styled.InlineCode>HttpOnly</Styled.InlineCode> cookies.</li>
                    <li><b>Don't</b> pass raw HTML props down your React tree; keep data/text separate from presentation.</li>
                    <li><b>Don't</b> whitelist everything - define minimal allowed tags/attrs when sanitizing.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Sanitization:</b> Removing/neutralizing dangerous parts of HTML.</li>
                    <li><b>Encoding/Escaping:</b> Representing characters safely for a specific context so they aren't interpreted as code.</li>
                    <li><b>Sink:</b> DOM/HTML/JS location where untrusted input gets interpreted (e.g., <Styled.InlineCode>innerHTML</Styled.InlineCode>).</li>
                    <li><b>Nonce:</b> Random token used in CSP to allow only scripts/styles that carry that token.</li>
                    <li><b>HttpOnly cookie:</b> Cookie that JS cannot read, mitigating theft via XSS.</li>
                    <li><b>SameSite cookie:</b> Restricts cross-site sending of cookies to help prevent CSRF.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Prevent XSS by defaulting to <b>render as text</b>, sanitizing any HTML, validating URLs,
                setting a <b>strict CSP</b>, and keeping tokens in <b>HttpOnly cookies</b>. React protects common cases,
                but sinks like <i>dangerouslySetInnerHTML</i> and direct DOM writes still require discipline.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Xss;
