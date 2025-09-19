import { Styled } from "./styled";

const EnvPerEnv = () => {
    return (
        <Styled.Page>
            <Styled.Title>Env per Env (Vite)</Styled.Title>

            <Styled.Lead>
                “Environment per environment” means your app reads different settings depending on where it runs:
                <b> development</b> on your laptop, <b>staging</b> for internal testing, and <b>production</b> for real users.
                With Vite, you use <Styled.InlineCode>.env</Styled.InlineCode> files and{" "}
                <Styled.InlineCode>import.meta.env</Styled.InlineCode> to inject safe, build-time variables.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions (read first)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Environment (env):</b> the context your app runs in (dev/test/staging/prod). Each env
                        can have different servers, flags, analytics keys, etc.
                    </li>
                    <li>
                        <b>Environment variable (env var):</b> a named value (like{" "}
                        <Styled.InlineCode>API_BASE_URL</Styled.InlineCode>) that controls behavior without changing code.
                    </li>
                    <li>
                        <b>Build time:</b> when Vite bundles your app. Variables injected here become{" "}
                        <em>static</em> in the built JS.
                    </li>
                    <li>
                        <b>Runtime:</b> when the user's browser executes your app. Vite's SPA builds cannot load new env vars
                        unless you fetch them (e.g., <i>window</i>-injected config or a fetched JSON).
                    </li>
                    <li>
                        <b>Public vs Secret:</b> Frontend code is downloadable by anyone—assume everything in it is <em>public</em>.
                        Never put true secrets (DB passwords, private keys) in the frontend. Keep secrets on the server.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Vite rules for env files */}
            <Styled.Section>
                <Styled.H2>Vite Env Rules (important)</Styled.H2>
                <Styled.List>
                    <li>
                        Files: <Styled.InlineCode>.env</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>.env.development</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>.env.staging</Styled.InlineCode> (custom),{" "}
                        <Styled.InlineCode>.env.production</Styled.InlineCode>, plus{" "}
                        <Styled.InlineCode>*.local</Styled.InlineCode> variants (ignored by Git).
                    </li>
                    <li>
                        <b>Prefix required:</b> Only variables prefixed with{" "}
                        <Styled.InlineCode>VITE_</Styled.InlineCode> are exposed to your client bundle.
                        Example: <Styled.InlineCode>VITE_API_BASE_URL</Styled.InlineCode>.
                    </li>
                    <li>
                        Access in code via <Styled.InlineCode>import.meta.env.VITE_*</Styled.InlineCode>.
                    </li>
                    <li>
                        Mode decides which file loads. Vite uses <Styled.InlineCode>development</Styled.InlineCode> by default for{" "}
                        <Styled.InlineCode>vite</Styled.InlineCode>/<Styled.InlineCode>dev</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>production</Styled.InlineCode> for{" "}
                        <Styled.InlineCode>build</Styled.InlineCode>. You can force a mode with{" "}
                        <Styled.InlineCode>--mode</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example env files (at project root):
// .env                -> shared defaults
// .env.development    -> only in dev
// .env.staging        -> only when --mode staging
// .env.production     -> only in prod
//
// .env.local, .env.development.local, etc. -> ignored by Git (put personal/local values here)

// Example contents:
VITE_APP_NAME="Notes ReactJS"
VITE_API_BASE_URL="http://localhost:5000"
VITE_FEATURE_FLAGS='{"betaSearch": true}'`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Reading env vars in components */}
            <Styled.Section>
                <Styled.H2>Reading Env Vars in React</Styled.H2>
                <Styled.Pre>
                    {`// Anywhere in your React code:
function EnvBadge() {
  const name = import.meta.env.VITE_APP_NAME;
  const base = import.meta.env.VITE_API_BASE_URL;
  const flags = JSON.parse(import.meta.env.VITE_FEATURE_FLAGS || "{}");

  return (
    <div>
      <strong>{name}</strong>
      <div>API: {base}</div>
      <div>betaSearch: {String(flags.betaSearch)}</div>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Tip: complex values like feature flags can be stored as JSON strings and{" "}
                    <Styled.InlineCode>JSON.parse()</Styled.InlineCode>d at runtime.
                </Styled.Small>
            </Styled.Section>

            {/* 4) API base URLs per environment */}
            <Styled.Section>
                <Styled.H2>API Base URLs per Environment</Styled.H2>
                <Styled.List>
                    <li>
                        Keep a different <Styled.InlineCode>VITE_API_BASE_URL</Styled.InlineCode> for dev/staging/prod.
                    </li>
                    <li>
                        Don't hard-code URLs in components. Centralize them in one config helper.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// src/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Example usage:
export async function getTopics() {
  const res = await fetch(\`\${API_BASE_URL}/topics\`);
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Modes & scripts */}
            <Styled.Section>
                <Styled.H2>Modes & Scripts</Styled.H2>
                <Styled.Pre>
                    {`// package.json (scripts)
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",               // uses mode=production by default
    "build:staging": "vite build --mode staging",
    "preview": "vite preview --port 4173"
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Running <Styled.InlineCode>npm run build:staging</Styled.InlineCode> loads{" "}
                    <Styled.InlineCode>.env.staging</Styled.InlineCode> in addition to base <Styled.InlineCode>.env</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Runtime config (optional) */}
            <Styled.Section>
                <Styled.H2>Runtime Config (when you can't rebuild)</Styled.H2>
                <Styled.List>
                    <li>
                        Vite inlines env at <b>build time</b>. If you must change config <em>without</em> rebuilding
                        (e.g., same build for staging & prod), load a small JSON or attach a global on{" "}
                        <Styled.InlineCode>window</Styled.InlineCode>.
                    </li>
                    <li>
                        This is useful on static hosts (e.g., GH Pages/CF Pages) where you deploy one build to multiple environments.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// public/runtime-config.json (deployed alongside the app)
{
  "API_BASE_URL": "https://api.example.com",
  "FEATURE_FLAGS": { "betaSearch": false }
}

// src/config/runtime.js
export async function loadRuntimeConfig() {
  const res = await fetch("/runtime-config.json", { cache: "no-store" });
  if (!res.ok) return {};
  return res.json();
}

// In your root (e.g., main.jsx):
// const runtime = await loadRuntimeConfig();
// const API_BASE_URL = runtime.API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL;`}
                </Styled.Pre>
                <Styled.Small>
                    Rule of thumb: prefer build-time env for simplicity. Use runtime config only when you truly need it.
                </Styled.Small>
            </Styled.Section>

            {/* 7) GH Pages, Vercel, Netlify, CF Pages notes */}
            <Styled.Section>
                <Styled.H2>Host Notes (GH Pages, Vercel, Netlify, CF Pages)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>GitHub Pages:</b> static hosting. Use build-time env files and set router base (e.g.,{" "}
                        <Styled.InlineCode>&lt;BrowserRouter basename="/notes-reactjs"&gt;</Styled.InlineCode>).
                        Runtime config requires a fetched JSON in <Styled.InlineCode>public/</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Vercel / Netlify:</b> support dashboard env vars that become build-time values. For SPA,
                        they're still public after build—treat as non-secrets.
                    </li>
                    <li>
                        <b>Cloudflare Pages:</b> similar to GH Pages (static). Use per-project env and/or runtime JSON.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Feature flags */}
            <Styled.Section>
                <Styled.H2>Feature Flags (simple pattern)</Styled.H2>
                <Styled.Pre>
                    {`// .env.development
VITE_FEATURE_FLAGS='{"betaSearch": true, "newNav": true}'

// .env.production
VITE_FEATURE_FLAGS='{"betaSearch": false, "newNav": false}'

// src/config/flags.js
export const FLAGS = Object.freeze(
  JSON.parse(import.meta.env.VITE_FEATURE_FLAGS || "{}")
);

// Usage in components:
{FLAGS.betaSearch && <BetaSearchBox />} // renders only when flag is true`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> prefix with <Styled.InlineCode>VITE_</Styled.InlineCode> and centralize access in small helpers.</li>
                    <li><b>Do</b> keep separate env files for dev/staging/prod; commit only non-sensitive ones.</li>
                    <li><b>Do</b> use <Styled.InlineCode>*.local</Styled.InlineCode> for machine-specific values (ignored by Git).</li>
                    <li><b>Don't</b> put secrets in frontend env—use a server/API for secrets.</li>
                    <li><b>Don't</b> scatter base URLs across components—use one config source.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Mode:</b> Vite's selected environment profile that decides which <Styled.InlineCode>.env.*</Styled.InlineCode> files load.</li>
                    <li><b>Prefix:</b> In Vite, only variables starting with <Styled.InlineCode>VITE_</Styled.InlineCode> are exposed to the client.</li>
                    <li><b>Runtime config:</b> Settings loaded by the browser at page load (e.g., fetched JSON), not baked in at build time.</li>
                    <li><b>Feature flag:</b> An on/off switch (env-driven) to enable or disable features safely.</li>
                    <li><b>Staging:</b> A production-like environment for final verification before going live.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pick build-time env for simplicity, runtime config only when you must change settings
                without rebuilding. Prefix with <b>VITE_</b>, never store secrets in the frontend, and centralize
                API URLs & flags so each environment behaves predictably.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default EnvPerEnv;
