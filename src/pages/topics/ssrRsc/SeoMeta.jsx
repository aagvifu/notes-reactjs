import React from "react";
import { Styled } from "./styled";

const SeoMeta = () => {
    return (
        <Styled.Page>
            <Styled.Title>SEO &amp; Metadata (SSR &amp; RSC Concepts)</Styled.Title>

            <Styled.Lead>
                <b>SEO (Search Engine Optimization)</b> is the practice of making your site discoverable and
                understandable to search engines and social platforms. <b>Metadata</b> lives in the HTML{" "}
                <Styled.InlineCode>&lt;head&gt;</Styled.InlineCode> (title, description, canonical, Open Graph,
                JSON-LD, etc.) and describes your page so crawlers and link unfurlers know what it is.
            </Styled.Lead>

            {/* 1) What is metadata & where it lives */}
            <Styled.Section>
                <Styled.H2>What is Metadata?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Title</b>: the page’s name shown in tabs and search results.
                    </li>
                    <li>
                        <b>Meta description</b>: summary under the title in results; not a ranking factor, but impacts CTR.
                    </li>
                    <li>
                        <b>Robots directives</b>: hints for indexing (e.g., <Styled.InlineCode>index</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>noindex</Styled.InlineCode>, <Styled.InlineCode>follow</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Canonical URL</b>: the “official” URL for duplicate/variant content.
                    </li>
                    <li>
                        <b>Open Graph &amp; Twitter Cards</b>: control link previews on social media.
                    </li>
                    <li>
                        <b>Structured Data (JSON-LD)</b>: machine-readable facts (articles, products, breadcrumbs).
                    </li>
                    <li>
                        <b>Viewport</b>: how the page scales on mobile; critical for Core Web Vitals.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Why SSR/SSG/ISR matter */}
            <Styled.Section>
                <Styled.H2>Why SSR/SSG/ISR help SEO</Styled.H2>
                <Styled.List>
                    <li>
                        <b>SSR (Server-Side Rendering)</b>: server sends complete HTML (including meta and content) so crawlers
                        and users see meaningful content on first response.
                    </li>
                    <li>
                        <b>SSG (Static Site Generation)</b>: HTML is prebuilt at build time; fastest delivery for mostly static pages.
                    </li>
                    <li>
                        <b>ISR (Incremental Static Regeneration)</b>: selectively re-generates pages after deploy on a schedule or on demand.
                    </li>
                    <li>
                        <b>Hydration</b>: client JS attaches interactivity to server/SSG HTML; meta is already present in the HTML.
                    </li>
                    <li>
                        <b>Streaming</b>: server sends HTML in chunks; head/meta should be ready early for quick discovery.
                    </li>
                </Styled.List>
                <Styled.Small>
                    SPA (client-only) can still rank, but SSR/SSG/ISR make metadata and content available without waiting on JS.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Core tags */}
            <Styled.Section>
                <Styled.H2>Core Head Tags (minimum viable SEO)</Styled.H2>
                <Styled.Pre>
                    {`<!-- index.html (global defaults) -->
<title>Site Name</title>
<meta name="description" content="Default site description." />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="canonical" href="https://example.com/" />
<meta name="robots" content="index,follow" />`}
                </Styled.Pre>
                <Styled.Small>
                    Set sensible defaults globally; override per-route when needed.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Social cards */}
            <Styled.Section>
                <Styled.H2>Social Cards: Open Graph &amp; Twitter</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Open Graph</b> (<Styled.InlineCode>og:</Styled.InlineCode>) controls previews on platforms like Facebook,
                        LinkedIn, Slack, etc.
                    </li>
                    <li>
                        <b>Twitter Cards</b> control previews on X (Twitter).
                    </li>
                    <li>
                        Recommended <b>og:image</b>: 1200×630 (aspect ~1.91:1), static URL, ≤5MB.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<meta property="og:title" content="React Notes — SEO & Metadata" />
<meta property="og:description" content="A guide to SEO tags in React." />
<meta property="og:url" content="https://example.com/ssr-rsc/seo-meta" />
<meta property="og:type" content="article" />
<meta property="og:image" content="https://example.com/og/seo-meta.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="React Notes — SEO & Metadata" />
<meta name="twitter:description" content="A guide to SEO tags in React." />
<meta name="twitter:image" content="https://example.com/og/seo-meta.png" />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Structured data */}
            <Styled.Section>
                <Styled.H2>Structured Data (JSON-LD)</Styled.H2>
                <Styled.List>
                    <li>
                        Add <b>JSON-LD</b> inside a <Styled.InlineCode>&lt;script type="application/ld+json"&gt;</Styled.InlineCode> tag.
                    </li>
                    <li>
                        Common types: <b>Article</b>, <b>BreadcrumbList</b>, <b>Product</b>, <b>Organization</b>, <b>FAQPage</b>.
                    </li>
                    <li>
                        Helps with rich results (stars, breadcrumbs, sitelinks).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"Article",
  "headline":"SEO & Metadata in React",
  "author":{"@type":"Person","name":"Ashish Ranjan"},
  "datePublished":"2025-09-17",
  "image":"https://example.com/og/seo-meta.png"
}
</script>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) SPA: per-route dynamic meta without extra libs */}
            <Styled.Section>
                <Styled.H2>SPA: Per-Route Meta (no extra library)</Styled.H2>
                <Styled.Pre>
                    {`// In a route component (CSR with Vite + React Router)
import React from "react";

function useMeta({ title, description, canonical, robots }) {
  React.useEffect(() => {
    if (title) document.title = title;

    const set = (selector, attr, value, createTag) => {
      if (!value) return;
      let el = document.head.querySelector(selector);
      if (!el && createTag) {
        el = document.createElement(createTag);
        if (createTag === "meta") el.setAttribute("name", selector.match(/name="(.+?)"/)[1]);
        document.head.appendChild(el);
      }
      if (el) el.setAttribute(attr, value);
    };

    set('meta[name="description"]', "content", description, "meta");
    // canonical link
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    if (canonical) link.setAttribute("href", canonical);
    // robots
    set('meta[name="robots"]', "content", robots, "meta");
  }, [title, description, canonical, robots]);
}

export default function SeoMetaPage() {
  useMeta({
    title: "SEO & Metadata — React Notes",
    description: "Guide to head tags, social cards, and JSON-LD.",
    canonical: "https://example.com/ssr-rsc/seo-meta",
    robots: "index,follow"
  });
  return <div>...</div>;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Simple and library-free. Note: This updates <i>after</i> JS runs, which is fine for SPAs but not as strong as SSR/SSG.
                </Styled.Small>
            </Styled.Section>

            {/* 7) SPA: per-route meta with react-helmet-async */}
            <Styled.Section>
                <Styled.H2>SPA: Per-Route Meta with <code>react-helmet-async</code></Styled.H2>
                <Styled.List>
                    <li>
                        A head manager that works in CSR and SSR. For CSR only, it simplifies setting tags per route.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// 1) install: npm i react-helmet-async
// 2) wrap app: <HelmetProvider><App/></HelmetProvider>
// 3) in a page:
import { Helmet } from "react-helmet-async";

export function SeoMetaHelmet() {
  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>SEO & Metadata — React Notes</title>
        <meta name="description" content="Guide to head tags, social cards, JSON-LD." />
        <link rel="canonical" href="https://example.com/ssr-rsc/seo-meta" />
        <meta name="robots" content="index,follow" />
        {/* Open Graph */}
        <meta property="og:title" content="SEO & Metadata — React Notes" />
        <meta property="og:description" content="Guide to head tags, social cards, JSON-LD." />
        <meta property="og:image" content="https://example.com/og/seo-meta.png" />
        <meta property="og:type" content="article" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main>...</main>
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) International & canonical */}
            <Styled.Section>
                <Styled.H2>Canonical, Duplicates &amp; Internationalization</Styled.H2>
                <Styled.List>
                    <li>
                        Use a <b>canonical</b> link to declare the preferred URL when the same content exists at multiple addresses (filters, UTMs, trailing slashes).
                    </li>
                    <li>
                        For multiple languages/regions, add <b>hreflang</b> links to indicate alternates.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<link rel="canonical" href="https://example.com/ssr-rsc/seo-meta" />
<link rel="alternate" href="https://example.com/en/seo-meta" hreflang="en" />
<link rel="alternate" href="https://example.com/hi/seo-meta" hreflang="hi" />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Performance-related head hints */}
            <Styled.Section>
                <Styled.H2>Performance Hints in <code>&lt;head&gt;</code></Styled.H2>
                <Styled.List>
                    <li><b>preconnect</b>: warm up connections to critical origins (fonts, APIs, CDN).</li>
                    <li><b>preload</b>: fetch a critical asset early (hero image, font); use carefully.</li>
                    <li><b>dns-prefetch</b>: lightweight hint for future origins.</li>
                </Styled.List>
                <Styled.Pre>
                    {`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" href="/hero-desktop.jpg" as="image" imagesrcset="/hero-desktop.jpg 1x, /hero-desktop@2x.jpg 2x" />
<link rel="dns-prefetch" href="//cdn.example.com" />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Robots & sitemap */}
            <Styled.Section>
                <Styled.H2>Robots &amp; Sitemaps</Styled.H2>
                <Styled.List>
                    <li>
                        <b>robots.txt</b>: high-level crawl rules per user-agent.
                    </li>
                    <li>
                        <b>XML sitemap</b>: list of canonical URLs to help discovery (update on deploy).
                    </li>
                    <li>
                        Use <b>noindex</b> on thin/private pages; <b>index</b> on canonical content.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`# robots.txt (example)
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml

<!-- Per-page override -->
<meta name="robots" content="noindex,follow" />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> write unique <i>title</i>/<i>description</i> per page; match the main content.</li>
                    <li><b>Do</b> provide a stable, absolute <i>canonical</i> URL for each page.</li>
                    <li><b>Do</b> host <i>og:image</i> at a permanent, crawlable URL; keep it under ~5MB.</li>
                    <li><b>Don’t</b> stuff keywords; keep copy human and accurate.</li>
                    <li><b>Don’t</b> switch canonical per user (UTMs, sort order)—pick one canonical.</li>
                    <li><b>Don’t</b> block JS/CSS in robots unless you know the impact; crawlers render pages.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Hydration</b>: attaching React event listeners to existing server/SSG HTML.</li>
                    <li><b>Streaming</b>: sending HTML in chunks; head can be sent early.</li>
                    <li><b>Canonical</b>: the single URL you want indexed for a page.</li>
                    <li><b>Open Graph</b>: meta spec for rich link previews.</li>
                    <li><b>JSON-LD</b>: JSON syntax for structured data in a script tag.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Ship accurate <i>title</i>, <i>description</i>, <i>canonical</i>, social cards, and JSON-LD.
                Prefer SSR/SSG/ISR when SEO matters so crawlers get metadata and content in the initial HTML. In SPAs,
                set per-route meta on mount or use a head manager like react-helmet-async.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default SeoMeta;
