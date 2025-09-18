import React from "react";
import { Styled } from "./styled";

const SsrVsSsgVsIsr = () => {
    return (
        <Styled.Page>
            <Styled.Title>SSR vs SSG vs ISR</Styled.Title>

            <Styled.Lead>
                Modern React apps can render pages at <b>build time</b>, at <b>request time</b>, or a mix of both with
                <b> revalidation</b>. Understanding these modes helps you pick the right strategy for <i>speed</i>, <i>SEO</i>, and <i>freshness</i>.
            </Styled.Lead>

            {/* 0) Baseline */}
            <Styled.Section>
                <Styled.H2>Baseline: CSR (Client-Side Rendering)</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> The server sends a minimal HTML shell + JS bundle. The browser runs JS to fetch data and render UI.</li>
                    <li><b>Implication:</b> Fast deploys, simple hosting. Initial HTML is sparse → slower first content if networks are slow.</li>
                    <li><b>Use when:</b> Auth-heavy dashboards, apps with mostly private data, or SEO is not a priority.</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) SSR */}
            <Styled.Section>
                <Styled.H2>SSR - Server-Side Rendering</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> HTML is generated <em>per request</em> on the server, then sent to the browser. The browser <b>hydrates</b> it (attaches event handlers) to make it interactive.</li>
                    <li><b>Request time:</b> Fresh data every request by default (can still cache).</li>
                    <li><b>Performance:</b> Better <b>TTFB</b> than CSR for content pages; data fetching happens on the server close to databases.</li>
                    <li><b>SEO:</b> Full HTML at response time helps crawlers.</li>
                    <li><b>Costs:</b> Server work on every request; careful with caching for scale.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Next.js (Pages Router) - SSR
export async function getServerSideProps(ctx) {
  const data = await fetch("https://api.example.com/items").then(r => r.json());
  return { props: { data } };
}
export default function Page({ data }) {
  return <ul>{data.map(it => <li key={it.id}>{it.name}</li>)}</ul>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 2) SSG */}
            <Styled.Section>
                <Styled.H2>SSG - Static Site Generation</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> HTML is generated <em>at build time</em>. Files are pushed to a CDN; no server compute is needed per request.</li>
                    <li><b>Build time:</b> Data is fetched during the build. Output is a static file.</li>
                    <li><b>Performance:</b> Excellent <b>TTFB</b>, <b>FCP</b>, <b>LCP</b> via CDN.</li>
                    <li><b>SEO:</b> Great (full HTML), but data is as fresh as the last build.</li>
                    <li><b>Costs:</b> Build times can grow if you pre-render many pages; content updates require a rebuild (unless using ISR).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Next.js (Pages Router) - SSG
export async function getStaticProps() {
  const data = await fetch("https://api.example.com/blog").then(r => r.json());
  return { props: { data } }; // Static at build time
}
export default function Blog({ data }) {
  return <div>{data.map(p => <article key={p.slug}>{p.title}</article>)}</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) ISR */}
            <Styled.Section>
                <Styled.H2>ISR - Incremental Static Regeneration</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> Start with <b>SSG</b>, then <b>re-generate</b> pages in the background at a configured interval. Visitors get static speed, content updates automatically.</li>
                    <li><b>Revalidation:</b> A TTL (e.g., 60 seconds) or tag-based invalidation triggers a background rebuild for the next request.</li>
                    <li><b>Staleness model:</b> Users may see slightly <em>stale</em> content until regeneration completes (<i>stale-while-revalidate</i> pattern).</li>
                    <li><b>Use when:</b> Mostly-static content that updates periodically (blogs, docs, catalogs).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Next.js (Pages Router) - ISR with revalidate
export async function getStaticProps() {
  const data = await fetch("https://api.example.com/news").then(r => r.json());
  return { props: { data }, revalidate: 60 }; // re-gen in background at most every 60s
}

// Next.js (App Router) - ISR (segment-level)
export const revalidate = 60;
export default async function Page() {
  const data = await fetch("https://api.example.com/news", { next: { revalidate: 60 }})
                .then(r => r.json());
  return <div>{data.items.map(n => <p key={n.id}>{n.title}</p>)}</div>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    App Router also supports <Styled.InlineCode>dynamic</Styled.InlineCode> and <Styled.InlineCode>cache</Styled.InlineCode> controls:
                    <Styled.Pre>
                        {`export const dynamic = "force-static";  // always static
// or
export const dynamic = "force-dynamic"; // always server-render per request
// fetch(url, { cache: "force-cache" | "no-store" })`}
                    </Styled.Pre>
                </Styled.Small>
            </Styled.Section>

            {/* 4) Decision guide */}
            <Styled.Section>
                <Styled.H2>Which one should I choose?</Styled.H2>
                <Styled.List>
                    <li><b>Marketing / Docs / Blog:</b> SSG → add ISR if content updates often.</li>
                    <li><b>Product listing with frequent updates:</b> ISR (fast + periodic freshness).</li>
                    <li><b>Per-user dashboards / highly personalized:</b> SSR (or CSR) - content depends on cookies/session.</li>
                    <li><b>Search pages with many filters:</b> SSR if SEO matters; CSR if SEO isn't critical.</li>
                    <li><b>Massive catalogs:</b> Hybrid - SSG core pages, ISR detail pages, SSR for search facets.</li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Performance & SEO */}
            <Styled.Section>
                <Styled.H2>Performance & SEO considerations</Styled.H2>
                <Styled.List>
                    <li><b>Hydration:</b> After SSR/SSG/ISR, the browser attaches JS to server-rendered HTML to make it interactive.</li>
                    <li><b>TTFB / FCP / LCP:</b> SSG/ISR often win via CDN. SSR performance depends on server time and caching.</li>
                    <li><b>Critical HTML:</b> Put above-the-fold content in the server render for SEO and fast paint; defer non-critical JS.</li>
                    <li><b>Caching:</b> Use HTTP cache headers/CDN. With SSR, consider cache keys that vary by <i>user/session</i> when needed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common pitfalls</Styled.H2>
                <Styled.List>
                    <li><b>"SSR automatically fixes SEO":</b> If real data still loads on the client after paint, crawlers may not see it. Render important content on the server.</li>
                    <li><b>"ISR for user-specific data":</b> Don't. ISR output is shared; use SSR/CSR for private pages.</li>
                    <li><b>Unbounded builds with SSG:</b> Pre-rendering tens of thousands of pages can bloat build time. Use ISR or on-demand generation.</li>
                    <li><b>Cache blindness:</b> For SSR, forgeting to vary cache by cookie/locale can leak content. Design cache keys carefully.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Minimal examples at a glance */}
            <Styled.Section>
                <Styled.H2>At a glance - minimal examples</Styled.H2>
                <Styled.Pre>
                    {`// SSR (Pages Router)
export async function getServerSideProps() { /* fetch per request */ return { props: { data: [] } }; }

// SSG (Pages Router)
export async function getStaticProps() { /* fetch at build */ return { props: { data: [] } }; }

// ISR (Pages Router)
export async function getStaticProps() { return { props: { data: [] }, revalidate: 120 }; }

// ISR (App Router)
export const revalidate = 120;
export default async function Page() {
  const data = await fetch(url, { next: { revalidate: 120 }}).then(r => r.json());
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Build time:</b> When your CI/CD generates static HTML before deployment.</li>
                    <li><b>Request time:</b> When the server renders HTML for each incoming HTTP request.</li>
                    <li><b>Hydration:</b> The browser attaching React event handlers to server-rendered HTML.</li>
                    <li><b>Revalidation (ISR):</b> Regenerating a static page after a TTL or on demand, typically in the background.</li>
                    <li><b>Stale-while-revalidate:</b> Serve a cached (possibly stale) page while re-generation happens.</li>
                    <li><b>TTFB/FCP/LCP:</b> Response and paint metrics; lower is better for perceived speed.</li>
                    <li><b>CDN:</b> Edge network that serves static assets close to users for low latency.</li>
                    <li><b>Personalization:</b> Content that varies by user (session/cookies/headers). Avoid caching across users.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <b>SSR</b> = fresh per request, great for personalized or frequently changing pages.{" "}
                <b>SSG</b> = static at build, best performance for stable content.{" "}
                <b>ISR</b> = static speed with scheduled freshness. Mix them as needed per route.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SsrVsSsgVsIsr;
