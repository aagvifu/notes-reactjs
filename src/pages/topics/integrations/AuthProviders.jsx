// src/pages/topics/integrations/AuthProviders.jsx
import React from "react";
import { Styled } from "./styled";

const AuthProviders = () => {
    return (
        <Styled.Page>
            <Styled.Title>Auth Providers (OAuth, OIDC, Social & Enterprise)</Styled.Title>

            <Styled.Lead>
                “Auth providers” let users sign in with existing identities (Google, GitHub, Apple, Azure AD, etc.).
                In React apps, you’ll typically integrate via <b>OAuth 2.0</b> and/or <b>OpenID Connect (OIDC)</b> on top of a secure backend.
                This page explains every moving part in plain terms, with code-oriented examples.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Authentication (AuthN):</b> verifying <i>who</i> the user is (login).</li>
                    <li><b>Authorization (AuthZ):</b> verifying <i>what</i> the user can do (permissions).</li>
                    <li><b>OAuth 2.0:</b> a delegation protocol to obtain access tokens for APIs without sharing passwords with the client app.</li>
                    <li><b>OpenID Connect (OIDC):</b> an identity layer on top of OAuth 2.0 that adds an <Styled.InlineCode>ID Token</Styled.InlineCode> (JWT) describing the user.</li>
                    <li><b>Identity Provider (IdP):</b> the service that authenticates users (Google, GitHub, Apple, Auth0, Azure AD, Keycloak, etc.).</li>
                    <li><b>Client (Relying Party):</b> your app that requests identity and tokens from the IdP.</li>
                    <li><b>Redirect URI / Callback URL:</b> where the IdP sends the user back after login.</li>
                    <li><b>Scopes:</b> permissions your app requests (e.g., <Styled.InlineCode>openid email profile</Styled.InlineCode>).</li>
                    <li><b>PKCE (Proof Key for Code Exchange):</b> protects the OAuth code flow in public clients (like SPAs) by binding the code to a one-time secret.</li>
                    <li><b>JWT (JSON Web Token):</b> signed token carrying claims (e.g., user id, email, expiry). Used for ID Tokens and often access/refresh tokens.</li>
                    <li><b>Session cookie:</b> server-managed login state stored in a cookie; often <i>httpOnly</i>, <i>secure</i>, and <i>SameSite</i> configured.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) What problem does an auth provider solve? */}
            <Styled.Section>
                <Styled.H2>Why Use an Auth Provider?</Styled.H2>
                <Styled.List>
                    <li><b>Less password handling:</b> delegate login to a trusted IdP.</li>
                    <li><b>Better UX:</b> one-tap or SSO across many apps.</li>
                    <li><b>Security:</b> MFA, device checks, suspicious login detection handled by the IdP.</li>
                    <li><b>Standardization:</b> OAuth/OIDC are well-defined, interoperable protocols.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) The standard SPA flow (OIDC Authorization Code + PKCE) */}
            <Styled.Section>
                <Styled.H2>Typical SPA Flow (Authorization Code + PKCE)</Styled.H2>
                <Styled.List>
                    <li><b>Step 1:</b> User clicks “Continue with Google”. You redirect to the IdP’s authorize URL with client id, scopes, <b>code_challenge</b>, <b>state</b>, and <b>redirect_uri</b>.</li>
                    <li><b>Step 2:</b> User logs in at the IdP. IdP redirects back to your <b>redirect_uri</b> with a one-time <b>authorization code</b> and your <b>state</b> value.</li>
                    <li><b>Step 3:</b> Your <b>backend</b> exchanges the code + <b>code_verifier</b> for tokens (<b>ID token</b>, <b>access token</b>, optionally <b>refresh token</b>).</li>
                    <li><b>Step 4:</b> Backend verifies tokens, creates a secure <b>session cookie</b> for the browser, and returns minimal user info to the SPA.</li>
                </Styled.List>
                <Styled.Small>
                    Why backend? So you can keep secrets off the client, set httpOnly cookies, and control token usage to your APIs.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Minimal React wiring: start & callback */}
            <Styled.Section>
                <Styled.H2>Minimal React Wiring (Start &amp; Callback)</Styled.H2>
                <Styled.Pre>
                    {`// LoginButton.jsx — "Start" auth by navigating to your backend's /auth/start
function LoginButton() {
  const startLogin = () => {
    // Backend builds the authorize URL (with PKCE) and redirects to IdP
    window.location.href = "/api/auth/google/start"; 
  };
  return <button onClick={startLogin}>Continue with Google</button>;
}

// CallbackPage.jsx — receives ?code & ?state on /auth/callback
function CallbackPage() {
  const [status, setStatus] = React.useState("working");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (!code) { setStatus("missing code"); return; }

    // Exchange code on the backend; backend sets httpOnly session cookie
    fetch("/api/auth/google/callback?code=" + encodeURIComponent(code) + "&state=" + encodeURIComponent(state), {
      credentials: "include",
    })
      .then(r => r.json())
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return <p>Login status: {status}</p>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    The backend handles PKCE and the token exchange. Your SPA just starts the flow and shows result.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Common provider options */}
            <Styled.Section>
                <Styled.H2>Common Provider Types</Styled.H2>
                <Styled.List>
                    <li><b>Consumer “social” IdPs:</b> Google, GitHub, Apple, Facebook—quick onboarding and public profiles.</li>
                    <li><b>Enterprise IdPs:</b> Azure AD / Entra, Okta, Auth0, Keycloak—SSO, SAML/OIDC, org management.</li>
                    <li><b>Passwordless:</b> Magic links or WebAuthn (passkeys) via dedicated providers.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Tokens, sessions, cookies */}
            <Styled.Section>
                <Styled.H2>Sessions, Tokens &amp; Cookies (What to Store Where)</Styled.H2>
                <Styled.List>
                    <li><b>ID Token (OIDC):</b> JWT with user identity claims; proves authentication.</li>
                    <li><b>Access Token:</b> authorization for API calls; short-lived; scoped.</li>
                    <li><b>Refresh Token:</b> long-lived; used by backend to mint new access tokens. <b>Rotate</b> and store securely server-side.</li>
                    <li><b>Session Cookie:</b> httpOnly + Secure + SameSite; ties the browser to a server-side session; ideal for SPAs to avoid exposing tokens in JS.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: call your API with browser session cookie automatically sent
fetch("/api/me", { credentials: "include" })
  .then(r => r.json())
  .then(user => console.log("Current user", user));`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Security must-knows */}
            <Styled.Section>
                <Styled.H2>Security Essentials</Styled.H2>
                <Styled.List>
                    <li><b>PKCE:</b> always use with public clients (SPAs, mobile).</li>
                    <li><b>State &amp; nonce:</b> verify on callback to prevent CSRF and replay attacks.</li>
                    <li><b>httpOnly cookies:</b> prevent JS access to session; set <Styled.InlineCode>Secure</Styled.InlineCode> and <Styled.InlineCode>SameSite</Styled.InlineCode> appropriately.</li>
                    <li><b>Callback URL allowlist:</b> only accept redirects to known origins/paths.</li>
                    <li><b>Refresh token rotation:</b> rotate and revoke on suspicious use.</li>
                    <li><b>CORS:</b> restrict origins; send <Styled.InlineCode>credentials: "include"</Styled.InlineCode> only when needed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Mapping providers to user accounts */}
            <Styled.Section>
                <Styled.H2>User Linking &amp; Profiles</Styled.H2>
                <Styled.List>
                    <li><b>Linking:</b> one local user can link multiple providers (e.g., Google + GitHub).</li>
                    <li><b>Stable key:</b> prefer the IdP’s stable subject/ID. Email can change.</li>
                    <li><b>Profile claims:</b> read <Styled.InlineCode>name</Styled.InlineCode>, <Styled.InlineCode>email</Styled.InlineCode>, <Styled.InlineCode>picture</Styled.InlineCode>; store only what you need.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Example provider matrix */}
            <Styled.Section>
                <Styled.H2>Example: Google &amp; GitHub Side-by-Side</Styled.H2>
                <Styled.Pre>
                    {`function SocialButtons() {
  return (
    <div className="stack">
      <button onClick={() => (window.location.href = "/api/auth/google/start")}>
        Continue with Google
      </button>
      <button onClick={() => (window.location.href = "/api/auth/github/start")}>
        Continue with GitHub
      </button>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Each backend route builds its own authorize URL and handles its callback.
                </Styled.Small>
            </Styled.Section>

            {/* 10) When to use libraries */}
            <Styled.Section>
                <Styled.H2>Use a Library or Roll Your Own?</Styled.H2>
                <Styled.List>
                    <li><b>Use a library</b> (e.g., NextAuth.js on Next.js, or server SDKs from your IdP) for speed and fewer mistakes.</li>
                    <li><b>Roll your own</b> if you need custom flows, multi-tenant logic, or are not on Next.js. Keep token exchange on the backend.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep secrets on the server. The SPA should never hold client secrets.</li>
                    <li><b>Do</b> store session in httpOnly cookies; avoid putting raw tokens in <Styled.InlineCode>localStorage</Styled.InlineCode>.</li>
                    <li><b>Do</b> verify ID tokens (signature, issuer, audience) on the backend.</li>
                    <li><b>Don’t</b> skip PKCE, state, or nonce—these are not optional.</li>
                    <li><b>Don’t</b> accept arbitrary <Styled.InlineCode>redirect_uri</Styled.InlineCode>—validate against a allowlist.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>IdP:</b> Identity Provider; authenticates users and issues tokens.</li>
                    <li><b>Relying Party:</b> the app that relies on IdP assertions (your app).</li>
                    <li><b>Claim:</b> a piece of info in a token (e.g., <Styled.InlineCode>sub</Styled.InlineCode> = user id).</li>
                    <li><b>Grant:</b> a way to obtain tokens (Authorization Code, Client Credentials, etc.).</li>
                    <li><b>SSO:</b> Single Sign-On—one login across many apps.</li>
                    <li><b>SAML:</b> XML-based enterprise SSO standard, often used by older/enterprise IdPs.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: in React SPAs, use <b>Authorization Code + PKCE</b>, handle exchanges on the <b>backend</b>,
                store login in a secure <b>httpOnly session cookie</b>, and rely on standards (OAuth, OIDC). Start simple
                with Google/GitHub, then add enterprise providers or passwordless as needed.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default AuthProviders;
