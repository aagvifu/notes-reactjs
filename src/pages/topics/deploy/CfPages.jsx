import { Styled } from "./styled";

const CfPages = () => {
    return (
        <Styled.Page>
            <Styled.Title>Cloudflare Pages (CF Pages)</Styled.Title>

            <Styled.Lead>
                <b>Cloudflare Pages</b> is a globally distributed static hosting platform. It serves your{" "}
                <Styled.InlineCode>dist/</Styled.InlineCode> build from edge locations, giving very low latency worldwide.
                For React + Vite, it's a great “push-to-deploy” choice with <b>Preview Deploys</b>,{" "}
                <b>Branch Deploys</b>, and optional <b>Pages Functions</b> for serverless logic.
            </Styled.Lead>

            {/* 1) Key definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Static hosting:</b> Serving pre-built files (HTML, JS, CSS, assets) directly, without a traditional server.
                    </li>
                    <li>
                        <b>Edge network (CDN):</b> A global network of data centers. Your files are cached close to users for faster loads.
                    </li>
                    <li>
                        <b>Build command:</b> The script that generates production assets (for Vite:{" "}
                        <Styled.InlineCode>npm run build</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Build output directory:</b> Where the build lands (for Vite:{" "}
                        <Styled.InlineCode>dist</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>SPA fallback:</b> A rule so unknown paths (e.g. <Styled.InlineCode>/about</Styled.InlineCode>) serve{" "}
                        <Styled.InlineCode>index.html</Styled.InlineCode> for client-side routing.
                    </li>
                    <li>
                        <b>Preview Deploy:</b> A per-pull-request environment so you can test changes before merging.
                    </li>
                    <li>
                        <b>Branch Deploy:</b> Auto deploys for specific branches (e.g., <Styled.InlineCode>main</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>develop</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Quick start */}
            <Styled.Section>
                <Styled.H2>One-Time Setup (GitHub → CF Pages)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>1. Prepare project:</b> Ensure it builds locally.
                        <Styled.Pre>
                            {`# package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`}
                        </Styled.Pre>
                    </li>
                    <li>
                        <b>2. Push to GitHub:</b> Your repo should contain <Styled.InlineCode>package.json</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>vite.config.[js|ts]</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>3. Create CF Pages project:</b> In the Cloudflare dashboard → Pages → <i>Create a project</i> →{" "}
                        <i>Connect to Git</i> → select your repo.
                    </li>
                    <li>
                        <b>4. Configure build:</b> Build command = <Styled.InlineCode>npm run build</Styled.InlineCode> · Output dir ={" "}
                        <Styled.InlineCode>dist</Styled.InlineCode> · Node version = your project's LTS is fine.
                    </li>
                    <li>
                        <b>5. Deploy:</b> CF Pages will install deps, run the build, and deploy to a{" "}
                        <Styled.InlineCode>*.pages.dev</Styled.InlineCode> URL. Merges to your chosen branch will auto-deploy.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) React Router: SPA fallback */}
            <Styled.Section>
                <Styled.H2>Client-Side Routing (SPA Fallback)</Styled.H2>
                <Styled.List>
                    <li>
                        For React Router (BrowserRouter), unknown paths must return <Styled.InlineCode>index.html</Styled.InlineCode>.
                    </li>
                    <li>
                        CF Pages supports a <b>_redirects</b> file. Add it at the repo root (or place it into{" "}
                        <Styled.InlineCode>public/</Styled.InlineCode> so it gets copied to <Styled.InlineCode>dist/</Styled.InlineCode>).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`# _redirects
/*    /index.html   200`}
                </Styled.Pre>
                <Styled.Small>
                    This ensures deep links (e.g., <Styled.InlineCode>/notes/react/hooks</Styled.InlineCode>) load your app rather
                    than a 404 from the CDN.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Cache-Control strategy */}
            <Styled.Section>
                <Styled.H2>Optimal Caching &amp; Headers</Styled.H2>
                <Styled.List>
                    <li>
                        Use a <b>_headers</b> file to control caching. Strategy:
                        <ul>
                            <li>
                                <b>Immutable assets</b> (hashed filenames in <Styled.InlineCode>dist/assets/*</Styled.InlineCode>): cache
                                for a year.
                            </li>
                            <li>
                                <b>HTML</b> (<Styled.InlineCode>index.html</Styled.InlineCode>): no-cache, so users always get the latest
                                bundle references.
                            </li>
                        </ul>
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`# _headers

# 1) HTML should not be cached aggressively
/index.html
  Cache-Control: no-cache

# 2) Hashed assets can be cached for a long time
/assets/*
  Cache-Control: public, max-age=31536000, immutable`}
                </Styled.Pre>
                <Styled.Small>
                    Place <Styled.InlineCode>_headers</Styled.InlineCode> at the repo root or ensure it's included in the final{" "}
                    <Styled.InlineCode>dist/</Styled.InlineCode> (e.g., via <Styled.InlineCode>public/_headers</Styled.InlineCode>).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Redirects & custom 404 */}
            <Styled.Section>
                <Styled.H2>Redirects &amp; Custom 404</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Redirects:</b> Add more rules to <Styled.InlineCode>_redirects</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`# _redirects examples

# legacy path to new docs section
/old-docs/*    /docs/:splat    301

# external redirect
/twitter       https://twitter.com/a2rp   302`}
                </Styled.Pre>
                <Styled.List>
                    <li>
                        <b>404 page:</b> Include <Styled.InlineCode>public/404.html</Styled.InlineCode> so CF Pages serves a friendly
                        not-found page (your app should still handle SPA routes via the fallback rule above).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Environment-per-environment */}
            <Styled.Section>
                <Styled.H2>Environment Variables (Per-Environment)</Styled.H2>
                <Styled.List>
                    <li>
                        Set environment variables in Pages → <i>Settings → Environment Variables</i>.
                    </li>
                    <li>
                        Use <Styled.InlineCode>VITE_*</Styled.InlineCode> prefixes to expose to the client (Vite rule).
                    </li>
                    <li>
                        Keep secrets <i>without</i> the <Styled.InlineCode>VITE_</Styled.InlineCode> prefix and consume them only in
                        Pages Functions (server-side) if needed.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`# Example usage in code (client)
const apiBase = import.meta.env.VITE_API_BASE_URL;

// In CF Pages dashboard:
// VITE_API_BASE_URL = "https://api.example.com" (Production)
// VITE_API_BASE_URL = "https://staging-api.example.com" (Preview)`}
                </Styled.Pre>
                <Styled.Small>
                    CF Pages separates <b>Production</b> vs <b>Preview</b> variables so your PR builds can point to staging
                    services safely.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Previews & branches */}
            <Styled.Section>
                <Styled.H2>Preview &amp; Branch Deploys</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Preview Deploy:</b> Every pull request gets a unique URL. Share it with reviewers for quick checks.
                    </li>
                    <li>
                        <b>Branch Deploy:</b> Choose which branches auto-deploy (e.g., <Styled.InlineCode>develop</Styled.InlineCode>{" "}
                        for staging, <Styled.InlineCode>main</Styled.InlineCode> for production).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Pages Functions (optional) */}
            <Styled.Section>
                <Styled.H2>Optional: Pages Functions (Serverless)</Styled.H2>
                <Styled.List>
                    <li>
                        If you need light server logic (auth callbacks, form handlers), add a{" "}
                        <Styled.InlineCode>functions/</Styled.InlineCode> directory (edge-runtime). Your app stays mostly static, with
                        only specific routes handled by functions.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// functions/hello-world.ts
export const onRequestGet: PagesFunction = async () => {
  return new Response("Hello from the edge!", { status: 200 });
};`}
                </Styled.Pre>
                <Styled.Small>
                    Keep secrets server-side in functions; never expose them as <Styled.InlineCode>VITE_</Styled.InlineCode> values.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Production monitoring */}
            <Styled.Section>
                <Styled.H2>Production Monitoring Basics</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Web Analytics:</b> Cloudflare Web Analytics or your preferred privacy-friendly analytics to track page views
                        and performance.
                    </li>
                    <li>
                        <b>Real User Monitoring (RUM):</b> Track Core Web Vitals (LCP, CLS, INP). Identify slow pages/assets.
                    </li>
                    <li>
                        <b>Error tracking:</b> Use a client-side tool (e.g., Sentry) to capture JS errors and source maps.
                    </li>
                    <li>
                        <b>Uptime:</b> External uptime pings on your production URL to catch outages quickly.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> commit <Styled.InlineCode>_redirects</Styled.InlineCode> for SPA fallback.</li>
                    <li><b>Do</b> add <Styled.InlineCode>_headers</Styled.InlineCode> for strong caching on hashed assets.</li>
                    <li><b>Do</b> split environment variables for Production vs Preview.</li>
                    <li><b>Don't</b> cache <Styled.InlineCode>index.html</Styled.InlineCode> aggressively-users won't see new builds.</li>
                    <li><b>Don't</b> expose secrets with a <Styled.InlineCode>VITE_</Styled.InlineCode> prefix-those go to the client.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: For Vite + React, CF Pages is “set it and forget it.” Build to <b>dist/</b>, add a SPA fallback via{" "}
                <b>_redirects</b>, tune caching with <b>_headers</b>, separate env vars by environment, and use Preview Deploys
                to verify changes before shipping.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CfPages;
