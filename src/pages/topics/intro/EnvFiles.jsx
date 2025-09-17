import React from "react";
import { Styled } from "./styled";

const EnvFiles = () => {
    return (
        <Styled.Page>
            <Styled.Title>.env Files (Vite)</Styled.Title>
            <Styled.Lead>
                Environment files provide per-environment configuration for the client
                app. In Vite, only variables prefixed with <b>VITE_</b> are exposed to
                the browser. Values are injected at build/dev time.
            </Styled.Lead>

            <Styled.Section>
                <Styled.H2>Key rules</Styled.H2>
                <Styled.List>
                    <li>
                        Only <Styled.InlineCode>VITE_*</Styled.InlineCode> keys are available in client code via{" "}
                        <Styled.InlineCode>import.meta.env</Styled.InlineCode>.
                    </li>
                    <li>
                        Built-ins always available:{" "}
                        <Styled.InlineCode>import.meta.env.MODE</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>DEV</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>PROD</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>BASE_URL</Styled.InlineCode>.
                    </li>
                    <li>
                        All env values are strings; convert to number/boolean in code when needed.
                    </li>
                    <li>
                        Do not store secrets in client env files; everything ships to the browser.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Common files & purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <Styled.InlineCode>.env</Styled.InlineCode> — defaults for all modes.
                    </li>
                    <li>
                        <Styled.InlineCode>.env.development</Styled.InlineCode> — overrides for dev.
                    </li>
                    <li>
                        <Styled.InlineCode>.env.production</Styled.InlineCode> — overrides for prod builds.
                    </li>
                    <li>
                        <Styled.InlineCode>.env.local</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>.env.&lt;mode&gt;.local</Styled.InlineCode> — developer-specific overrides (keep out of git).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`# .gitignore (ensure local env files are ignored)
.env.local
.env.development.local
.env.production.local
.env.test.local`}
                </Styled.Pre>
                <Styled.Small>
                    Recommended pattern: place defaults in <code>.env</code>, override by mode in{" "}
                    <code>.env.development</code>/<code>.env.production</code>, use{" "}
                    <code>.env.*.local</code> for machine-specific values.
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Declaring variables</Styled.H2>
                <Styled.Pre>
                    {`# .env
VITE_APP_NAME=React Notes
VITE_API_BASE=/api
VITE_ENABLE_ANALYTICS=false
VITE_PAGE_SIZE=20`}
                </Styled.Pre>
                <Styled.Pre>
                    {`# .env.production
VITE_API_BASE=https://api.example.com
VITE_ENABLE_ANALYTICS=true`}
                </Styled.Pre>
                <Styled.Small>
                    Quoting is optional for plain strings. Values are parsed as strings;
                    coerce types in code (Number/Boolean).
                </Styled.Small>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Using variables in code</Styled.H2>
                <Styled.Pre>
                    {`// read variables
const name = import.meta.env.VITE_APP_NAME;         // "React Notes"
const api  = import.meta.env.VITE_API_BASE;         // "/api" or "https://api.example.com"
const on   = import.meta.env.VITE_ENABLE_ANALYTICS; // "false" or "true" (string)
const size = import.meta.env.VITE_PAGE_SIZE;        // "20" (string)

// coerce types
const ENABLE_ANALYTICS = on === "true";
const PAGE_SIZE = Number(size) || 10;

// using BASE_URL (public base path from vite.config.js -> base)
const assetUrl = import.meta.env.BASE_URL + "logo.svg";`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Modes and custom environments</Styled.H2>
                <Styled.List>
                    <li>
                        Default dev mode is <Styled.InlineCode>development</Styled.InlineCode>; default build mode is{" "}
                        <Styled.InlineCode>production</Styled.InlineCode>.
                    </li>
                    <li>
                        Custom mode (e.g., <em>staging</em>) loads{" "}
                        <Styled.InlineCode>.env</Styled.InlineCode> +{" "}
                        <Styled.InlineCode>.env.staging</Styled.InlineCode> (+{" "}
                        <Styled.InlineCode>.env.staging.local</Styled.InlineCode> if present).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`# package.json (scripts)
{
  "scripts": {
    "dev": "vite",
    "dev:staging": "vite --mode staging",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "preview": "vite preview"
  }
}`}
                </Styled.Pre>
                <Styled.Pre>
                    {`# .env.staging (example)
VITE_API_BASE=https://staging-api.example.com
VITE_ENABLE_ANALYTICS=false`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Small helper (optional)</Styled.H2>
                <p>Lightweight helper to read env values with defaults and coercion.</p>
                <Styled.Pre>
                    {`// utils/env.js
export const env = {
  string(key, fallback = "") {
    const v = import.meta.env[key];
    return typeof v === "string" ? v : fallback;
  },
  bool(key, fallback = false) {
    const v = import.meta.env[key];
    if (v === "true") return true;
    if (v === "false") return false;
    return fallback;
  },
  number(key, fallback = 0) {
    const n = Number(import.meta.env[key]);
    return Number.isFinite(n) ? n : fallback;
  },
};

// usage
// const API = env.string("VITE_API_BASE", "/api");`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Section>
                <Styled.H2>Security note</Styled.H2>
                <Styled.List>
                    <li>
                        Client env files are public configuration. Never embed private API keys, DB URLs with credentials,
                        or secrets. Place secrets on a server or edge function and call that from the client.
                    </li>
                    <li>
                        Consider a small backend proxy for protected APIs; the client reads{" "}
                        <Styled.InlineCode>VITE_API_BASE</Styled.InlineCode> that points to the proxy.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: prefix with <b>VITE_</b>, organize defaults vs per-mode overrides, keep{" "}
                <code>.env.*.local</code> out of git, coerce types in code, and avoid placing secrets in client envs.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default EnvFiles;
