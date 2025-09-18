// src/pages/topics/security/CorsCookies.jsx
import React from "react";
import { Styled } from "./styled";

const CorsCookies = () => {
    return (
        <Styled.Page>
            <Styled.Title>CORS &amp; Cookies</Styled.Title>

            <Styled.Lead>
                <b>CORS</b> (Cross-Origin Resource Sharing) is a browser security policy that controls whether a web page
                from one <i>origin</i> may read responses from a different origin. <b>Cookies</b> are small key-value pairs
                the browser stores and automatically attaches to matching requests. Understanding how they interact is essential
                for secure SPAs and APIs.
            </Styled.Lead>

            {/* 1) Same-Origin Policy (SOP) */}
            <Styled.Section>
                <Styled.H2>Same-Origin Policy (SOP)</Styled.H2>
                <Styled.List>
                    <li><b>Origin:</b> the tuple <Styled.InlineCode>scheme://host:port</Styled.InlineCode> (e.g., <Styled.InlineCode>https://app.example.com:443</Styled.InlineCode>).</li>
                    <li><b>SOP:</b> by default, scripts on one origin cannot read responses from another origin.</li>
                    <li><b>Different origins examples:</b> <Styled.InlineCode>https://app.example.com</Styled.InlineCode> vs <Styled.InlineCode>https://api.example.com</Styled.InlineCode> (host differs), or <Styled.InlineCode>http</Styled.InlineCode> vs <Styled.InlineCode>https</Styled.InlineCode> (scheme differs), or ports differ.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) What is CORS */}
            <Styled.Section>
                <Styled.H2>What is CORS?</Styled.H2>
                <Styled.List>
                    <li><b>CORS:</b> an HTTP header protocol that lets servers explicitly say which origins may read their responses.</li>
                    <li><b>Simple request:</b> <Styled.InlineCode>GET</Styled.InlineCode>, <Styled.InlineCode>HEAD</Styled.InlineCode>, or <Styled.InlineCode>POST</Styled.InlineCode> with content types <Styled.InlineCode>text/plain</Styled.InlineCode>, <Styled.InlineCode>multipart/form-data</Styled.InlineCode>, or <Styled.InlineCode>application/x-www-form-urlencoded</Styled.InlineCode>, and only simple headers.</li>
                    <li><b>Preflight:</b> for other cases (custom headers, non-simple methods like <Styled.InlineCode>PUT/DELETE</Styled.InlineCode>, or <Styled.InlineCode>application/json</Styled.InlineCode>), the browser first sends an <Styled.InlineCode>OPTIONS</Styled.InlineCode> request to ask permission.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Typical preflight
OPTIONS /users HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type

// Server grants
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET,POST,PUT,DELETE
Access-Control-Allow-Headers: content-type
Access-Control-Max-Age: 600
Vary: Origin`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Key CORS response headers */}
            <Styled.Section>
                <Styled.H2>Key CORS Response Headers</Styled.H2>
                <Styled.List>
                    <li><b>Access-Control-Allow-Origin</b>: allowed origin (exact string) or <Styled.InlineCode>*</Styled.InlineCode> (any). <b>Note:</b> cannot be <Styled.InlineCode>*</Styled.InlineCode> when sending cookies.</li>
                    <li><b>Access-Control-Allow-Credentials</b>: <Styled.InlineCode>true</Styled.InlineCode> if the server allows credentials (cookies, Authorization header) to be sent and read.</li>
                    <li><b>Access-Control-Allow-Methods</b>: methods permitted on the resource.</li>
                    <li><b>Access-Control-Allow-Headers</b>: non-simple request headers the server accepts (e.g., <Styled.InlineCode>content-type</Styled.InlineCode>, <Styled.InlineCode>authorization</Styled.InlineCode>).</li>
                    <li><b>Access-Control-Max-Age</b>: how long the preflight result can be cached by the browser.</li>
                    <li><b>Vary: Origin</b>: tells caches the response depends on the <Styled.InlineCode>Origin</Styled.InlineCode> request header.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Cookies: attributes that matter */}
            <Styled.Section>
                <Styled.H2>Cookies &amp; Important Attributes</Styled.H2>
                <Styled.List>
                    <li><b>Cookie:</b> a small key-value sent by the server via <Styled.InlineCode>Set-Cookie</Styled.InlineCode>; the browser auto-attaches it to subsequent matching requests.</li>
                    <li><b>Domain/Path:</b> scoping rules for where the cookie is sent.</li>
                    <li><b>Secure:</b> only sent over <Styled.InlineCode>https</Styled.InlineCode>.</li>
                    <li><b>HttpOnly:</b> not readable from JavaScript (mitigates XSS data theft).</li>
                    <li><b>SameSite</b>: controls cross-site sending:
                        <ul>
                            <li><b>Lax:</b> sent on top-level navigations (safe default for sessions).</li>
                            <li><b>Strict:</b> only first-party; strongest CSRF protection, may break SSO flows.</li>
                            <li><b>None:</b> sent in all contexts, <b>requires Secure</b>, used for legitimate cross-site cases.</li>
                        </ul>
                    </li>
                    <li><b>Max-Age / Expires:</b> cookie lifetime (session vs persistent).</li>
                    <li><b>Prefixes:</b> <Styled.InlineCode>__Host-</Styled.InlineCode> (must be Secure, no Domain attribute, Path=/) and <Styled.InlineCode>__Secure-</Styled.InlineCode> (must be Secure).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Session cookie, CSRF-resistant default
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Lax

// Cross-site cookie (e.g., central auth under a different domain)
Set-Cookie: idpToken=...; Path=/; Secure; SameSite=None

// Strictest (won't be sent on cross-site navigations)
Set-Cookie: csrftoken=...; Path=/; Secure; HttpOnly; SameSite=Strict`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Using fetch/axios with cookies */}
            <Styled.Section>
                <Styled.H2>Sending Cookies with Fetch/Axios</Styled.H2>
                <Styled.List>
                    <li>Browsers <i>do not</i> send cross-origin cookies by default in XHR/fetch. You must opt-in to <b>credentials</b>.</li>
                    <li>Server must also echo <Styled.InlineCode>Access-Control-Allow-Credentials: true</Styled.InlineCode> and a <b>specific</b> <Styled.InlineCode>Access-Control-Allow-Origin</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// fetch (credentials)
await fetch("https://api.example.com/me", {
  method: "GET",
  credentials: "include", // send and accept cookies
});

// axios
axios.get("https://api.example.com/me", { withCredentials: true });`}
                </Styled.Pre>
                <Styled.Small>
                    If you see: <i>"Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '*'"</i>,
                    set a specific origin instead of <Styled.InlineCode>*</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Server-side CORS examples */}
            <Styled.Section>
                <Styled.H2>Server Examples (Node/Express)</Styled.H2>
                <Styled.Pre>
                    {`// (A) Using the 'cors' package
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "https://app.example.com", // or a function to reflect/whitelist
  credentials: true,                 // allows cookies/Authorization
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["content-type", "authorization"],
  maxAge: 600
}));

app.get("/me", (req, res) => { res.json({ ok: true }); });

// (B) Manual headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = ["https://app.example.com"];
  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type,authorization");
    res.setHeader("Access-Control-Max-Age", "600");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Security notes: tokens & CSRF */}
            <Styled.Section>
                <Styled.H2>Security Notes: Tokens, XSS, and CSRF</Styled.H2>
                <Styled.List>
                    <li><b>CORS is not auth:</b> it only governs which origins may read responses. You still need authentication/authorization.</li>
                    <li><b>HttpOnly session cookies</b> protect tokens from JavaScript access (mitigate XSS data theft).</li>
                    <li><b>CSRF:</b> happens when a victim's browser auto-sends cookies to a target site from a malicious page. Mitigate with <Styled.InlineCode>SameSite=Lax/Strict</Styled.InlineCode>, CSRF tokens on state-changing requests, and double-submit patterns if needed.</li>
                    <li><b>LocalStorage tokens:</b> not auto-sent, so less CSRF-prone; but readable by JS (risk on XSS). If used, harden against XSS.</li>
                    <li><b>Prefer</b> server-set, <Styled.InlineCode>HttpOnly; Secure; SameSite=Lax</Styled.InlineCode> cookies for session auth in browser apps.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> send a specific <Styled.InlineCode>Access-Control-Allow-Origin</Styled.InlineCode> when using credentials.</li>
                    <li><b>Do</b> set <Styled.InlineCode>Vary: Origin</Styled.InlineCode> for cache correctness.</li>
                    <li><b>Do</b> use <Styled.InlineCode>Secure</Styled.InlineCode>, <Styled.InlineCode>HttpOnly</Styled.InlineCode>, and an appropriate <Styled.InlineCode>SameSite</Styled.InlineCode> on auth cookies.</li>
                    <li><b>Don't</b> expose wildcard origin with credentials (<Styled.InlineCode>*</Styled.InlineCode> + cookies is invalid).</li>
                    <li><b>Don't</b> treat CORS as a firewall; validate auth and authorize on the server.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting</Styled.H2>
                <Styled.List>
                    <li><b>Blocked by CORS:</b> check server headers match request (origin, methods, headers) and preflight response has status 204/200.</li>
                    <li><b>Credentials ignored:</b> ensure <Styled.InlineCode>credentials: "include"</Styled.InlineCode> (or <Styled.InlineCode>withCredentials: true</Styled.InlineCode>) and <Styled.InlineCode>Access-Control-Allow-Credentials: true</Styled.InlineCode> + non-wildcard <Styled.InlineCode>Allow-Origin</Styled.InlineCode>.</li>
                    <li><b>Cookie not set:</b> cross-site cookies require <Styled.InlineCode>SameSite=None; Secure</Styled.InlineCode>; domain/path must match; HTTPS required for <Styled.InlineCode>Secure</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Origin:</b> scheme + host + port tuple.</li>
                    <li><b>Simple request:</b> a request that avoids preflight due to method/headers/content-type constraints.</li>
                    <li><b>Preflight:</b> the browser's permission check (<Styled.InlineCode>OPTIONS</Styled.InlineCode>) before the actual request.</li>
                    <li><b>Credentials:</b> cookies, Authorization headers, TLS client certs—user-specific data attached to requests.</li>
                    <li><b>First-party vs Third-party cookie:</b> whether the cookie's site matches the top-level page's site.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: CORS lets servers opt-in to cross-origin reads, while cookies carry state. Use precise CORS headers,
                send credentials intentionally, and harden auth cookies with Secure/HttpOnly/SameSite for safe, reliable browser auth.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CorsCookies;
