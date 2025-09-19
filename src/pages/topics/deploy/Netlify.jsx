import { Styled } from "./styled";

const Netlify = () => {
    return (
        <Styled.Page>
            <Styled.Title>Deploy on Netlify</Styled.Title>

            <Styled.Lead>
                <b>Netlify</b> is a platform for hosting modern frontends. You connect your Git repo,
                it builds your app, and serves the optimized static files globally via a CDN.
                It also gives you preview URLs for every branch/PR and tools like redirects,
                headers, environment variables, and serverless/edge functions if you need them.
            </Styled.Lead>

            {/* 1) Core Definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>CDN (Content Delivery Network):</b> a network of servers that caches and serves your static files from locations close to users.</li>
                    <li><b>Build command:</b> the script Netlify runs to produce production assets (for Vite, typically <Styled.InlineCode>npm run build</Styled.InlineCode>).</li>
                    <li><b>Publish directory:</b> the folder containing final build output that gets served (for Vite, <Styled.InlineCode>dist/</Styled.InlineCode>).</li>
                    <li><b>Continuous Deployment (CI/CD):</b> each push to your main branch triggers an auto build + deploy.</li>
                    <li><b>Preview Deploy:</b> an isolated deployment created for non-main branches or Pull Requests for testing.</li>
                    <li><b>Redirect:</b> a rule that rewrites one URL to another (useful for SPA routing).</li>
                    <li><b>Headers:</b> extra HTTP metadata you control (e.g., caching, security).</li>
                    <li><b>Environment variable:</b> key–value config available at build/runtime without hard-coding secrets (e.g., <Styled.InlineCode>VITE_API_URL</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Quick Start (GitHub CI/CD) */}
            <Styled.Section>
                <Styled.H2>Quick Start (GitHub → Netlify CI/CD)</Styled.H2>
                <Styled.List>
                    <li>Push your Vite app to GitHub (ensure <Styled.InlineCode>npm run build</Styled.InlineCode> works locally).</li>
                    <li>In Netlify dashboard: <b>New site from Git</b> → choose Git provider → select repo.</li>
                    <li><b>Build command:</b> <Styled.InlineCode>npm run build</Styled.InlineCode></li>
                    <li><b>Publish directory:</b> <Styled.InlineCode>dist</Styled.InlineCode></li>
                    <li>Click <b>Deploy site</b>. Netlify builds and gives you a live URL.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// package.json (Vite default)
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    If the build fails, check Node version in Netlify &quot;Site settings → Build &amp; deploy → Environment&quot; (match your local version).
                </Styled.Small>
            </Styled.Section>

            {/* 3) SPA Routing (Very Important) */}
            <Styled.Section>
                <Styled.H2>Single-Page App Routing (Must-do)</Styled.H2>
                <Styled.List>
                    <li>React Router uses client-side routing. On page refresh of a deep link (e.g., <Styled.InlineCode>/about</Styled.InlineCode>), the server must return <Styled.InlineCode>index.html</Styled.InlineCode>.</li>
                    <li>Configure Netlify redirects so <b>any</b> path falls back to <Styled.InlineCode>index.html</Styled.InlineCode> (status 200).</li>
                </Styled.List>
                <Styled.Pre>
                    {`# netlify.toml (at repo root)
[build]
  command = "npm run build"
  publish = "dist"

# Redirect all routes to index.html (SPA fallback)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`}
                </Styled.Pre>
                <Styled.Small>
                    Alternatively, you can create a <Styled.InlineCode>_redirects</Styled.InlineCode> file in <Styled.InlineCode>public/</Styled.InlineCode> with the same rule: <Styled.InlineCode>/*  /index.html  200</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Deploy with CLI (Optional but Useful) */}
            <Styled.Section>
                <Styled.H2>Deploy with Netlify CLI (Optional)</Styled.H2>
                <Styled.List>
                    <li><b>Netlify CLI:</b> local tool to preview Netlify-like environment and deploy on demand.</li>
                    <li><Styled.InlineCode>netlify init</Styled.InlineCode> links your local project to a Netlify site.</li>
                    <li><Styled.InlineCode>netlify deploy</Styled.InlineCode> makes a draft deploy; <Styled.InlineCode>netlify deploy --prod</Styled.InlineCode> publishes to production.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# one-time install
npm i -g netlify-cli

# inside your project
netlify init                  # link local folder to Netlify site
npm run build                 # create dist/
netlify deploy                # draft deploy (get a preview URL)
netlify deploy --prod         # publish to production
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Environment Variables per Environment */}
            <Styled.Section>
                <Styled.H2>Environment Variables (Dev / Preview / Prod)</Styled.H2>
                <Styled.List>
                    <li>Set variables in Netlify: <b>Site settings → Environment variables</b>. You can scope them to <b>Deploy Previews</b> vs <b>Production</b>.</li>
                    <li>In Vite, only variables prefixed with <Styled.InlineCode>VITE_</Styled.InlineCode> are exposed to client code.</li>
                    <li>Access in code via <Styled.InlineCode>import.meta.env.VITE_*</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example usage in Vite + React
const apiBase = import.meta.env.VITE_API_BASE_URL;
// Use apiBase in fetch(...) and keep secrets out of source code.
`}
                </Styled.Pre>
                <Styled.Small>
                    Keep true secrets on the server side (don't expose tokens to the browser). For public keys/config, <Styled.InlineCode>VITE_</Styled.InlineCode> is OK.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Cache-Control & Headers */}
            <Styled.Section>
                <Styled.H2>Cache-Control &amp; Headers</Styled.H2>
                <Styled.List>
                    <li><b>Cache-Control:</b> tells browsers/CDNs how long to cache assets. Fingerprinted files (e.g., <Styled.InlineCode>chunk-XYZ.js</Styled.InlineCode>) can be cached for a long time.</li>
                    <li><b>No-cache for HTML:</b> keep <Styled.InlineCode>index.html</Styled.InlineCode> fresh so users get the latest bundle on next load.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    # Security headers (optional but good practice)
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`}
                </Styled.Pre>
                <Styled.Small>
                    Vite emits hashed assets, which are safe for long caching. The HTML should not be cached aggressively.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Forms & Redirects (Optional) */}
            <Styled.Section>
                <Styled.H2>Optional: Forms &amp; Redirects</Styled.H2>
                <Styled.List>
                    <li><b>Netlify Forms:</b> you can enable static form handling by adding <Styled.InlineCode>data-netlify="true"</Styled.InlineCode> to a form in your HTML and a hidden input with the form name.</li>
                    <li><b>Custom redirects:</b> map old paths to new ones or add 301/302 rules for SEO.</li>
                </Styled.List>
                <Styled.Pre>
                    {`# public/_redirects
/old-route   /new-route   301
`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Production Monitoring */}
            <Styled.Section>
                <Styled.H2>Production Monitoring (Basics)</Styled.H2>
                <Styled.List>
                    <li><b>Deploy notifications:</b> enable Slack/Email on successful or failed builds.</li>
                    <li><b>Uptime checks:</b> use an external uptime service to ping your site and alert on downtime.</li>
                    <li><b>Error tracking:</b> integrate a client-side tracker (e.g., Sentry) to capture JS errors.</li>
                    <li><b>Performance:</b> periodically run Lighthouse and watch TTI, LCP, CLS after deploys.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Troubleshooting & Pitfalls */}
            <Styled.Section>
                <Styled.H2>Troubleshooting &amp; Pitfalls</Styled.H2>
                <Styled.List>
                    <li><b>404 on refresh:</b> you forgot SPA fallback. Add the redirect to <Styled.InlineCode>index.html</Styled.InlineCode>.</li>
                    <li><b>Env var not visible:</b> missing <Styled.InlineCode>VITE_</Styled.InlineCode> prefix or you forgot to redeploy after changing it.</li>
                    <li><b>Stale bundle:</b> browser cached old assets. Ensure HTML is <i>no-cache</i> and assets are long-cache with hashes.</li>
                    <li><b>Build fails on Netlify only:</b> Node version mismatch or missing install step. Set Node version and check build logs.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Connect Git → set build (<i>npm run build</i>) and publish (<i>dist</i>) → add SPA fallback →
                tune headers and env vars → verify with preview deploys → monitor after go-live.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Netlify;
