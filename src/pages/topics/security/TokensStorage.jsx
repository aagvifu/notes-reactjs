import React from "react";
import { Styled } from "./styled";

const TokensStorage = () => {
    return (
        <Styled.Page>
            <Styled.Title>Tokens Storage</Styled.Title>

            <Styled.Lead>
                <b>Token storage</b> = how your frontend keeps credentials (usually short-lived{" "}
                <Styled.InlineCode>access tokens</Styled.InlineCode> and long-lived{" "}
                <Styled.InlineCode>refresh tokens</Styled.InlineCode>) so it can call protected APIs securely.
                The goal is to <b>minimize exposure</b> to <i>XSS</i> and <i>CSRF</i> while keeping UX smooth.
            </Styled.Lead>

            {/* 1) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (clear definitions)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Access token:</b> short-lived credential presented to APIs (often a string or JWT) via
                        <Styled.InlineCode>Authorization: Bearer &lt;token&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Refresh token:</b> longer-lived credential used <i>only</i> to obtain new access tokens.
                        Should not be exposed to JS when possible.
                    </li>
                    <li>
                        <b>JWT (JSON Web Token):</b> compact string with <i>header</i>, <i>payload (claims)</i>, and{" "}
                        <i>signature</i>. Verifiable by the API without a DB lookup. Signed, not encrypted.
                    </li>
                    <li>
                        <b>Bearer token:</b> any party holding the token is treated as the user. If leaked, it can
                        be used until it expires or is revoked.
                    </li>
                    <li>
                        <b>XSS (Cross-Site Scripting):</b> attacker runs JS in your page. If tokens live in{" "}
                        <Styled.InlineCode>localStorage</Styled.InlineCode> or variables, they may be stolen.
                    </li>
                    <li>
                        <b>CSRF (Cross-Site Request Forgery):</b> browser auto-sends cookies on cross-site requests.
                        An attacker site can trigger a user’s cookies unless you defend (SameSite/CSRF tokens).
                    </li>
                    <li>
                        <b>HttpOnly cookie:</b> cookie not readable from JS (<Styled.InlineCode>document.cookie</Styled.InlineCode>).
                        Helps against XSS stealing the value.
                    </li>
                    <li>
                        <b>Secure cookie:</b> cookie only sent over HTTPS.
                    </li>
                    <li>
                        <b>SameSite</b> cookie attribute: governs cross-site sending:{" "}
                        <Styled.InlineCode>Lax</Styled.InlineCode> (default, safe for most),{" "}
                        <Styled.InlineCode>Strict</Styled.InlineCode> (safest, may break some flows),{" "}
                        <Styled.InlineCode>None</Styled.InlineCode> (allows cross-site; must be Secure).
                    </li>
                    <li>
                        <b>CORS:</b> browser protection controlling which origins can read responses. Doesn’t protect
                        against CSRF by itself.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Where can we store tokens? */}
            <Styled.Section>
                <Styled.H2>Storage options (and risks)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>In-memory (JS variable/state):</b> disappears on refresh. <i>Best for access tokens</i>—not
                        readable by other tabs, reduces persistence if XSS occurs (attacker must be present “now”).
                    </li>
                    <li>
                        <b>HttpOnly cookies:</b> not readable by JS; auto-sent to the server. Good place for{" "}
                        <i>refresh tokens</i> or server sessions. Must handle CSRF (SameSite/CSRF token).
                    </li>
                    <li>
                        <b>localStorage / sessionStorage:</b> simple, but <i>readable by JS</i>. If XSS happens, tokens can be exfiltrated.
                        Avoid for long-lived secrets (refresh tokens).
                    </li>
                    <li>
                        <b>IndexedDB:</b> also JS-readable; similar XSS risk profile.
                    </li>
                </Styled.List>

                <Styled.Callout>
                    Rule of thumb: <b>Access token in memory</b>, <b>Refresh token in HttpOnly cookie</b>, or use{" "}
                    <b>cookie-based session</b> (no tokens in JS at all).
                </Styled.Callout>
            </Styled.Section>

            {/* 3) Pattern A: Memory access token + HttpOnly refresh cookie */}
            <Styled.Section>
                <Styled.H2>Pattern A — Memory access token + HttpOnly refresh cookie</Styled.H2>
                <Styled.List>
                    <li>
                        On login, server sets <b>refresh</b> token cookie (
                        <Styled.InlineCode>HttpOnly; Secure; SameSite=Lax</Styled.InlineCode>) and returns a short-lived{" "}
                        <b>access</b> token in the JSON response.
                    </li>
                    <li>
                        Client keeps the access token <i>only in memory</i>. When it expires (401), call{" "}
                        <Styled.InlineCode>/auth/refresh</Styled.InlineCode>—the browser sends the refresh cookie
                        automatically; server returns a new access token.
                    </li>
                    <li>
                        Logout = clear memory token + call server to invalidate refresh cookie (server clears cookie / rotates server-side state).
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Minimal example: centralized fetch wrapper (no libraries)
let accessToken = null; // in-memory only

export function setAccessToken(t) { accessToken = t; }
export function clearAccessToken() { accessToken = null; }

async function refreshAccessToken() {
  // Sends refresh cookie automatically; server replies with a fresh access token
  const res = await fetch("/auth/refresh", { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {});
  if (accessToken) headers.set("Authorization", "Bearer " + accessToken);

  const res = await fetch(input, { ...init, headers, credentials: "include" });

  if (res.status !== 401) return res;

  // Attempt a one-time refresh then retry:
  const newToken = await refreshAccessToken();
  const retryHeaders = new Headers(init.headers || {});
  retryHeaders.set("Authorization", "Bearer " + newToken);
  return fetch(input, { ...init, headers: retryHeaders, credentials: "include" });
}
`}
                </Styled.Pre>

                <Styled.Small>
                    Notes: handle concurrency (queue 401s while one refresh is in flight), rotate refresh tokens on each use,
                    and keep access tokens short-lived (e.g., 5–15 minutes).
                </Styled.Small>
            </Styled.Section>

            {/* 4) Pattern B: Cookie-only session (no tokens in JS) */}
            <Styled.Section>
                <Styled.H2>Pattern B — Cookie-only session (no tokens in JS)</Styled.H2>
                <Styled.List>
                    <li>
                        Server issues a <b>session cookie</b> (<Styled.InlineCode>HttpOnly; Secure; SameSite=Lax</Styled.InlineCode>).
                        Client never sees a token; it just calls APIs, and the cookie authenticates.
                    </li>
                    <li>
                        Must defend against <b>CSRF</b>: use <Styled.InlineCode>SameSite=Lax/Strict</Styled.InlineCode> and/or{" "}
                        <b>CSRF tokens</b> (double-submit or stateful token on server).
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`// Example CSRF pattern (double-submit cookie):
// 1) Server sets 'csrf' cookie (readable by JS).
// 2) Client reads 'csrf' cookie and sends it back in a header with each state-changing request.
// 3) Server validates cookie value == header value.

async function postWithCsrf(url, body) {
  const csrf = document.cookie
    .split("; ")
    .find(c => c.startsWith("csrf="))
    ?.split("=")[1];

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "x-csrf": csrf || "" },
    body: JSON.stringify(body),
  });
  return res;
}
`}
                </Styled.Pre>
                <Styled.Small>
                    Where possible, prefer <b>SameSite=Lax</b> + CSRF token on state-changing requests (POST/PUT/PATCH/DELETE).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep access tokens short-lived; refresh silently when needed.</li>
                    <li><b>Do</b> store refresh tokens in <b>HttpOnly</b> cookies (not readable by JS).</li>
                    <li><b>Do</b> use <Styled.InlineCode>Secure</Styled.InlineCode> cookies and HTTPS everywhere.</li>
                    <li><b>Do</b> set <Styled.InlineCode>SameSite=Lax</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>Strict</Styled.InlineCode> on auth cookies to reduce CSRF.</li>
                    <li><b>Do</b> rotate refresh tokens; revoke on logout or suspicion.</li>
                    <li><b>Don’t</b> put long-lived refresh tokens in <Styled.InlineCode>localStorage</Styled.InlineCode>.</li>
                    <li><b>Don’t</b> expose secrets (API keys) in frontend code; those belong on the server.</li>
                    <li><b>Don’t</b> rely on CORS alone for CSRF protection—CORS is about who can <i>read</i> responses.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls & fixes</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Storing tokens where XSS can read them:</b> prefer memory or HttpOnly cookies; fix XSS by sanitizing user content and using a strict CSP.
                    </li>
                    <li>
                        <b>Unbounded token lifetimes:</b> set expiry, rotate refresh tokens, implement server-side revocation.
                    </li>
                    <li>
                        <b>Insecure cookie attributes:</b> always set <Styled.InlineCode>Secure</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>HttpOnly</Styled.InlineCode>, and a safe <Styled.InlineCode>SameSite</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>No CSRF defense with cookies:</b> use SameSite and CSRF tokens for state-changing routes.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Quick checklist */}
            <Styled.Section>
                <Styled.H2>Implementation checklist</Styled.H2>
                <Styled.List>
                    <li>Access token in memory (or cookie-only session).</li>
                    <li>Refresh token in HttpOnly Secure cookie (SameSite=Lax/Strict).</li>
                    <li>Short access token TTL; refresh endpoint that rotates refresh tokens.</li>
                    <li>CSRF protection for cookie-authenticated writes.</li>
                    <li>Logout clears access token in memory and invalidates cookie on server.</li>
                    <li>Handle retry race conditions (single refresh in flight; queue 401s).</li>
                    <li>Monitor for token replay anomalies; add IP/device checks if appropriate.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: keep the <b>blast radius</b> small. Use <i>memory</i> for access tokens, <i>HttpOnly cookies</i> for
                refresh/session, short expiries, rotation, and explicit CSRF defenses. Simpler is safer.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default TokensStorage;
