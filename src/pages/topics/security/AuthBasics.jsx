import React from "react";
import { Styled } from "./styled";

const AuthBasics = () => {
    return (
        <Styled.Page>
            <Styled.Title>Auth Basics</Styled.Title>

            <Styled.Lead>
                <b>Authentication</b> proves <i>who you are</i>. <b>Authorization</b> decides <i>what you can do</i>.
                Web apps implement auth using <b>sessions</b> (cookies) or <b>tokens</b> (e.g., JWT). Understanding the
                terms and the common flows helps you choose safe defaults for React SPAs.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Identity:</b> who the user is (e.g., user id/email).</li>
                    <li><b>Credential:</b> a secret used to prove identity (password, OTP, passkey, OAuth grant).</li>
                    <li><b>Authentication:</b> verifying credentials; result is a trusted session or token.</li>
                    <li><b>Authorization:</b> allowing/denying actions/resources after auth (roles, permissions, scopes).</li>
                    <li><b>Session:</b> server-side record of a logged-in user; client holds only a session <i>id</i> cookie.</li>
                    <li><b>Token:</b> self-contained or opaque string the client presents on each request (e.g., in <Styled.InlineCode>Authorization: Bearer</Styled.InlineCode>).</li>
                    <li><b>JWT (JSON Web Token):</b> signed, base64url-encoded claims (e.g., <Styled.InlineCode>sub</Styled.InlineCode>, <Styled.InlineCode>exp</Styled.InlineCode>, roles).</li>
                    <li><b>Access token:</b> short-lived token used to access APIs.</li>
                    <li><b>Refresh token:</b> longer-lived credential used to obtain new access tokens.</li>
                    <li><b>Cookie:</b> small key/value stored by the browser; may be <b>HttpOnly</b> (not readable by JS) and <b>Secure</b> (HTTPS only).</li>
                    <li><b>SameSite:</b> cookie rule controlling cross-site sending: <b>Lax</b> (default), <b>Strict</b>, or <b>None</b> (requires Secure).</li>
                    <li><b>CSRF:</b> Cross-Site Request Forgery—an attacker makes the browser send your cookies to a site.</li>
                    <li><b>XSS:</b> Cross-Site Scripting—attacker runs arbitrary JS in your page context.</li>
                    <li><b>OAuth 2.0:</b> framework to obtain access tokens (delegated access).</li>
                    <li><b>OIDC (OpenID Connect):</b> identity layer on top of OAuth that adds login/user info.</li>
                    <li><b>PKCE:</b> Proof Key for Code Exchange—secures OAuth <i>Authorization Code</i> flow in public clients (SPAs).</li>
                    <li><b>Scopes:</b> strings describing allowed actions (“read:invoices”).</li>
                    <li><b>Claims:</b> data inside tokens (e.g., user id, expiry, roles).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Two common models */}
            <Styled.Section>
                <Styled.H2>Two Common Auth Models</Styled.H2>

                <Styled.H3>1) Server Session (Cookie)</Styled.H3>
                <Styled.List>
                    <li>Server verifies login → creates a session in DB/Redis → sets a <b>session id cookie</b> (<Styled.InlineCode>HttpOnly; Secure; SameSite=Lax</Styled.InlineCode>).</li>
                    <li>Browser auto-sends cookie; server looks up the session and authorizes.</li>
                    <li><b>Pros:</b> simple to reason about, easy rotation, <b>HttpOnly</b> cookies mitigate XSS token theft.</li>
                    <li><b>Cons:</b> must design to prevent CSRF (use SameSite, CSRF tokens, double submit, etc.).</li>
                </Styled.List>

                <Styled.H3>2) Token-Based (JWT / Opaque)</Styled.H3>
                <Styled.List>
                    <li>Server/IdP issues <b>access</b> (short-lived) and optionally <b>refresh</b> tokens.</li>
                    <li>Client sends <Styled.InlineCode>Authorization: Bearer &lt;access_token&gt;</Styled.InlineCode> to APIs.</li>
                    <li><b>Pros:</b> easy API fan-out, stateless access tokens.</li>
                    <li><b>Cons:</b> where to store tokens? XSS can steal tokens from JS-readable storage; refresh flows add complexity.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) SPA patterns */}
            <Styled.Section>
                <Styled.H2>Recommended SPA Patterns</Styled.H2>
                <Styled.List>
                    <li><b>Auth Code + PKCE (with OIDC):</b> SPA redirects to provider; receives an authorization code; exchanges it (with PKCE) for tokens.</li>
                    <li><b>BFF pattern:</b> a small backend-for-frontend holds tokens/cookies; SPA talks only to the BFF. Reduces token exposure to the browser.</li>
                    <li><b>Short-lived access tokens in memory:</b> keep access token only in memory; use a <b>HttpOnly refresh token cookie</b> or refresh endpoint behind BFF.</li>
                    <li><b>SameSite and CSRF:</b> if using cookies to auth APIs, use <Styled.InlineCode>SameSite=Lax/Strict</Styled.InlineCode> and a CSRF token for state-changing requests.</li>
                </Styled.List>

                <Styled.Pre>
                    {`// Minimal shape for an in-memory access token approach (client):
const auth = {
  accessToken: null,          // never store in localStorage if you can avoid it
  async login(creds) {
    // POST /auth/login returns { accessToken } and sets a refresh cookie (HttpOnly, SameSite=Lax)
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send/receive cookies
      body: JSON.stringify(creds),
    });
    const data = await res.json();
    this.accessToken = data.accessToken; // keep in memory only
  },
  async fetchWithAuth(input, init = {}) {
    const res = await fetch(input, {
      ...init,
      headers: { ...(init.headers || {}), Authorization: \`Bearer \${this.accessToken}\` },
      credentials: "include",
    });
    if (res.status === 401) {
      // Try to refresh (server looks up refresh cookie & rotates)
      const r = await fetch("/auth/refresh", { method: "POST", credentials: "include" });
      if (r.ok) {
        const { accessToken } = await r.json();
        this.accessToken = accessToken;
        return this.fetchWithAuth(input, init); // retry once
      }
    }
    return res;
  },
};`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Note:</b> This is conceptual. Real apps add error handling, retries, logout, and revoke/rotate refresh tokens.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Storage choices */}
            <Styled.Section>
                <Styled.H2>Where to Store Tokens?</Styled.H2>
                <Styled.List>
                    <li><b>Memory:</b> safest against persistent XSS (disappears on reload). <i>Recommended</i> for access tokens.</li>
                    <li><b>HttpOnly Cookie:</b> not readable by JS; good for session ids and refresh tokens. Configure <Styled.InlineCode>Secure</Styled.InlineCode> + <Styled.InlineCode>SameSite</Styled.InlineCode>.</li>
                    <li><b>localStorage/sessionStorage:</b> easy but vulnerable to XSS token theft. Avoid for long-lived secrets.</li>
                    <li><b>IndexedDB:</b> slightly better ergonomics than localStorage but still JS-readable → XSS risk persists.</li>
                </Styled.List>

                <Styled.Callout>
                    Rule of thumb: <b>Access token in memory</b>, <b>refresh token in HttpOnly cookie</b>, or use a <b>BFF</b>.
                </Styled.Callout>
            </Styled.Section>

            {/* 5) CSRF vs XSS matrix */}
            <Styled.Section>
                <Styled.H2>CSRF vs XSS: What to Watch</Styled.H2>
                <Styled.List>
                    <li><b>CSRF (cookie-backed APIs):</b> protect with <Styled.InlineCode>SameSite</Styled.InlineCode>, CSRF tokens (per form/request), and check <Styled.InlineCode>Origin/Referer</Styled.InlineCode> on the server.</li>
                    <li><b>XSS (token theft):</b> sanitize/escape user content, use CSP, avoid <Styled.InlineCode>dangerouslySetInnerHTML</Styled.InlineCode>, and never eval untrusted code.</li>
                    <li><b>JWT misuse:</b> don't trust client claims; always verify signature and <Styled.InlineCode>exp</Styled.InlineCode>/<Styled.InlineCode>aud</Styled.InlineCode>/<Styled.InlineCode>iss</Styled.InlineCode> server-side.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Guarded routes (client) */}
            <Styled.Section>
                <Styled.H2>Guarded Routes (Client-Side)</Styled.H2>
                <Styled.Pre>
                    {`// Conceptual PrivateRoute (React Router v6)
import { Navigate, Outlet, useLocation } from "react-router-dom";
function PrivateRoute({ isAuthed }) {
  const location = useLocation();
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

// Usage in routes:
// <Route element={<PrivateRoute isAuthed={auth.isLoggedIn} />}>
//   <Route path="/dashboard" element={<Dashboard />} />
// </Route>

// IMPORTANT: Client guards are UX only.
// Real protection must happen on the SERVER (verify session/token on every request).`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Login & logout basics */}
            <Styled.Section>
                <Styled.H2>Login & Logout (Cookie Session Example)</Styled.H2>
                <Styled.Pre>
                    {`// Login (server will set HttpOnly session cookie)
await fetch("/auth/session/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email, password }),
});

// Authenticated API call (cookie auto-sent)
await fetch("/api/profile", { credentials: "include" });

// Logout (server clears session & cookie)
await fetch("/auth/session/logout", { method: "POST", credentials: "include" });`}
                </Styled.Pre>
                <Styled.Small>
                    With cookies, the browser handles sending credentials; ensure CORS and cookie flags are configured properly.
                </Styled.Small>
            </Styled.Section>

            {/* 8) CORS + Cookies quick rules */}
            <Styled.Section>
                <Styled.H2>CORS + Cookies (Quick Rules)</Styled.H2>
                <Styled.List>
                    <li>Set <Styled.InlineCode>fetch(..., {`{ credentials: "include" }`})</Styled.InlineCode> to send cookies cross-site.</li>
                    <li>Server must set <Styled.InlineCode>Access-Control-Allow-Credentials: true</Styled.InlineCode> and a specific <Styled.InlineCode>Access-Control-Allow-Origin</Styled.InlineCode> (not <i>*</i>).</li>
                    <li>Set cookies with <Styled.InlineCode>Secure; HttpOnly; SameSite=Lax</Styled.InlineCode> (or <Styled.InlineCode>None</Styled.InlineCode> + <Styled.InlineCode>Secure</Styled.InlineCode> for third-party).</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Passwords & accounts */}
            <Styled.Section>
                <Styled.H2>Password & Account Safety</Styled.H2>
                <Styled.List>
                    <li><b>Hash passwords</b> with modern algorithms (bcrypt/argon2) and a per-user salt; never store plaintext.</li>
                    <li><b>Rate limit</b> login and sensitive endpoints; implement lockout/captcha after repeated failures.</li>
                    <li><b>MFA/2FA</b> (TOTP, WebAuthn/passkeys) to harden high-value accounts.</li>
                    <li><b>Session fixation:</b> issue a fresh session id after login.</li>
                    <li><b>Logout everywhere:</b> support session/token revocation.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep access tokens short-lived; refresh/rotate securely.</li>
                    <li><b>Do</b> validate tokens server-side (sig + expiry + audience/issuer).</li>
                    <li><b>Do</b> use <b>HttpOnly Secure</b> cookies (SameSite set) or BFF pattern.</li>
                    <li><b>Don't</b> store long-lived tokens in <Styled.InlineCode>localStorage</Styled.InlineCode>.</li>
                    <li><b>Don't</b> trust client-side route guards for security; always enforce on the server.</li>
                    <li><b>Don't</b> put secrets in front-end env files—they ship to the browser.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary (quick lookup) */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>BFF:</b> Backend-for-Frontend—a small server that fronts APIs and manages auth on behalf of the SPA.</li>
                    <li><b>Nonce:</b> random value used to bind OIDC id_token to the auth request, preventing replay/mix-up.</li>
                    <li><b>State (OAuth):</b> random string to tie the callback to the initiation request (CSRF protection).</li>
                    <li><b>Opaque token:</b> a random string that the server introspects instead of reading claims client-side.</li>
                    <li><b>Introspection:</b> server endpoint that validates an opaque token and returns its active/claims data.</li>
                    <li><b>CSP:</b> Content Security Policy—HTTP header restricting sources of scripts/styles to mitigate XSS.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Bottom line:</b> Prefer <i>short-lived access tokens in memory</i> with <i>refresh via HttpOnly cookie</i> or a <i>BFF</i>.
                Always verify auth on the server, and harden against both <b>XSS</b> and <b>CSRF</b>.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default AuthBasics;
