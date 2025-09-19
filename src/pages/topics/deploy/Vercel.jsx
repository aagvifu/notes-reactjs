import { Styled } from "./styled";

const Vercel = () => {
    return (
        <Styled.Page>
            <Styled.Title>Vercel (Deploying a Vite + React App)</Styled.Title>

            <Styled.Lead>
                <b>Vercel</b> is a cloud platform that builds and hosts websites from your repository.
                For a Vite + React Single-Page App (SPA), Vercel serves your static build output
                from a global CDN and lets you add features like preview deployments, custom domains,
                and environment variables per environment.
            </Styled.Lead>

            {/* 1) What is Vercel? */}
            <Styled.Section>
                <Styled.H2>What is Vercel?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Platform:</b> A hosting service that automatically <i>builds</i> your project and
                        <i>deploys</i> it to a fast global CDN.
                    </li>
                    <li>
                        <b>Build:</b> A reproducible step that runs your package scripts (e.g.,{" "}
                        <Styled.InlineCode>npm run build</Styled.InlineCode>) to generate a{" "}
                        <Styled.InlineCode>dist/</Styled.InlineCode> folder ready for hosting.
                    </li>
                    <li>
                        <b>CDN (Content Delivery Network):</b> A network of servers around the world that cache
                        and serve your static files (HTML/CSS/JS) quickly to users.
                    </li>
                    <li>
                        <b>Preview Deployment:</b> A unique URL created for every pull request/branch so you
                        can test changes before merging.
                    </li>
                    <li>
                        <b>Production Deployment:</b> The live, public version assigned to your main branch or a specific deployment.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Project prerequisites */}
            <Styled.Section>
                <Styled.H2>Project prerequisites (Vite + React)</Styled.H2>
                <Styled.List>
                    <li>
                        Ensure you can build locally:{" "}
                        <Styled.InlineCode>npm run build</Styled.InlineCode> → generates{" "}
                        <Styled.InlineCode>dist/</Styled.InlineCode>.
                    </li>
                    <li>
                        SPA routing: your app uses <Styled.InlineCode>react-router</Styled.InlineCode>. You'll add a
                        <b>rewrite</b> rule so Vercel serves <Styled.InlineCode>index.html</Styled.InlineCode> for all routes.
                    </li>
                    <li>
                        Environment variables must be prefixed with{" "}
                        <Styled.InlineCode>VITE_</Styled.InlineCode> to be exposed to the browser.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Ways to deploy */}
            <Styled.Section>
                <Styled.H2>Ways to deploy to Vercel</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Git-based (recommended):</b> Connect your GitHub repo in the Vercel dashboard. Every push triggers a build and a
                        new Preview; merging to the main branch creates a Production deployment.
                    </li>
                    <li>
                        <b>Vercel CLI:</b> Install the CLI (<Styled.InlineCode>npm i -g vercel</Styled.InlineCode>) and run{" "}
                        <Styled.InlineCode>vercel</Styled.InlineCode> (Preview) or{" "}
                        <Styled.InlineCode>vercel --prod</Styled.InlineCode> (Production) from your project folder.
                    </li>
                    <li>
                        <b>Manual upload:</b> Build locally and use the dashboard to upload the{" "}
                        <Styled.InlineCode>dist/</Styled.InlineCode> folder (less common for teams).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Build & output settings for Vite */}
            <Styled.Section>
                <Styled.H2>Build & output settings (Vite)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Build command:</b> <Styled.InlineCode>npm run build</Styled.InlineCode>
                    </li>
                    <li>
                        <b>Output directory:</b> <Styled.InlineCode>dist</Styled.InlineCode>
                    </li>
                    <li>
                        <b>Install command:</b> <Styled.InlineCode>npm install</Styled.InlineCode> (Vercel picks this automatically).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// package.json (typical for Vite)
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) SPA routing (rewrites) */}
            <Styled.Section>
                <Styled.H2>SPA routing (serve index.html for all routes)</Styled.H2>
                <Styled.List>
                    <li>
                        A <b>rewrite</b> tells Vercel to serve <Styled.InlineCode>/index.html</Styled.InlineCode> for any path that
                        doesn't match a static file. This is required for React Router to handle client-side routes like{" "}
                        <Styled.InlineCode>/about</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>/dashboard/settings</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// vercel.json (put this at the project root)
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}
                </Styled.Pre>
                <Styled.Small>
                    Tip: If you later add API routes or serverless functions, place specific routes above this
                    catch-all rewrite.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Environment variables per environment */}
            <Styled.Section>
                <Styled.H2>Environment variables (Development, Preview, Production)</Styled.H2>
                <Styled.List>
                    <li>
                        Vercel has three environments: <b>Development</b> (local), <b>Preview</b> (PRs/branches),{" "}
                        <b>Production</b> (main/live).
                    </li>
                    <li>
                        Frontend vars must start with <Styled.InlineCode>VITE_</Styled.InlineCode> (e.g.,{" "}
                        <Styled.InlineCode>VITE_API_URL</Styled.InlineCode>). Define them in Vercel →
                        Project Settings → Environment Variables and choose which environments they apply to.
                    </li>
                    <li>
                        You can still keep <Styled.InlineCode>.env</Styled.InlineCode> files locally:
                        <Styled.InlineCode>.env</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>.env.development</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>.env.production</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Using an env var in code
const api = import.meta.env.VITE_API_URL; // read at build time
`}
                </Styled.Pre>
                <Styled.Small>
                    Changes to env vars require a new deployment to take effect (values are injected at build time).
                </Styled.Small>
            </Styled.Section>

            {/* 7) Cache-Control headers for assets */}
            <Styled.Section>
                <Styled.H2>Cache-Control for better performance</Styled.H2>
                <Styled.List>
                    <li>
                        Cache static assets (hashed files) aggressively to speed up repeat visits. Use{" "}
                        <Styled.InlineCode>immutable</Styled.InlineCode> for files with content hashes.
                    </li>
                    <li>
                        Keep <Styled.InlineCode>index.html</Styled.InlineCode> lightly cached (or no-cache) so new deployments are picked up quickly.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// vercel.json (headers example)
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" }
      ]
    }
  ]
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Custom domains */}
            <Styled.Section>
                <Styled.H2>Custom domains</Styled.H2>
                <Styled.List>
                    <li>
                        Add your domain in Vercel → Project Settings → Domains. Vercel provides step-by-step DNS records
                        (CNAME/A) to point your domain to the deployment.
                    </li>
                    <li>
                        Once verified, your Production deployment will be served from your domain (e.g.,{" "}
                        <Styled.InlineCode>https://yourname.dev</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Logs & monitoring */}
            <Styled.Section>
                <Styled.H2>Logs & monitoring</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Deployment logs:</b> See build output and errors in the Vercel dashboard.
                    </li>
                    <li>
                        <b>Request logs (for functions):</b> If you add serverless/edge functions, Vercel shows
                        invocation logs and errors.
                    </li>
                    <li>
                        <b>Frontend monitoring:</b> Add a client-side tool (e.g., Sentry) for error tracking and
                        performance metrics in the browser.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Common errors & fixes */}
            <Styled.Section>
                <Styled.H2>Common errors & how to fix them</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Blank page / routing 404s:</b> Add the SPA rewrite so all routes serve{" "}
                        <Styled.InlineCode>index.html</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Env variable undefined:</b> Make sure it's defined in Vercel, prefixed with{" "}
                        <Styled.InlineCode>VITE_</Styled.InlineCode>, and redeploy after changes.
                    </li>
                    <li>
                        <b>Wrong output dir:</b> Set output to <Styled.InlineCode>dist</Styled.InlineCode> (Vite default).
                    </li>
                    <li>
                        <b>Mixed content (HTTP/HTTPS):</b> Use HTTPS URLs for APIs/assets to avoid browser blocking.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Quick checklist */}
            <Styled.Section>
                <Styled.H2>Quick checklist (copy/paste)</Styled.H2>
                <Styled.Pre>
                    {`- [ ] Project builds locally (npm run build → dist/)
- [ ] vercel.json with SPA rewrites
- [ ] Cache-Control for assets (immutable) and index.html (no-cache)
- [ ] VITE_* env vars configured per environment
- [ ] Custom domain added and DNS verified
- [ ] Smoke test: open Preview URL and navigate through routes
- [ ] Promote to Production (merge or vercel --prod)`}
                </Styled.Pre>
            </Styled.Section>

            {/* 12) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep <Styled.InlineCode>index.html</Styled.InlineCode> minimally cached.</li>
                    <li><b>Do</b> use <Styled.InlineCode>VITE_</Styled.InlineCode> prefix for browser-exposed env vars.</li>
                    <li><b>Do</b> rely on Preview deployments for QA before merging.</li>
                    <li><b>Don't</b> hardcode environment URLs in code—read from env vars.</li>
                    <li><b>Don't</b> place secrets in the repo—store them as Vercel env vars.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Rewrite:</b> Server rule that changes the destination file served for a request
                        (e.g., send every path to <Styled.InlineCode>index.html</Styled.InlineCode> for SPAs).
                    </li>
                    <li>
                        <b>Headers:</b> Key/value metadata sent with responses (e.g.,{" "}
                        <Styled.InlineCode>Cache-Control</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Preview:</b> A temporary deployment for a feature branch or PR.
                    </li>
                    <li>
                        <b>Production:</b> The live deployment tied to your main branch or promoted build.
                    </li>
                    <li>
                        <b>Immutable:</b> A cache hint telling browsers/CDNs a file will never change at this URL.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: connect your repo, ensure a clean Vite build, add SPA rewrites, configure per-env
                variables, and set cache headers. Use Preview deployments to test confidently, then promote
                to Production and add your custom domain.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Vercel;
