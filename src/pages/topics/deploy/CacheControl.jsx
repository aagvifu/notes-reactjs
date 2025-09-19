import React from "react";
import { Styled } from "./styled";

/**
 * Deployment — Cache Control
 * Goal: Explain browser/CDN caching for SPAs built with Vite/React.
 * Style: Definitions first, then practical recipes, then platform snippets.
 */

const CacheControl = () => {
    return (
        <Styled.Page>
            <Styled.Title>Cache Control</Styled.Title>

            <Styled.Lead>
                <b>Cache control</b> is how we tell browsers and CDNs which files they can keep,
                for how long, and when to re-download. Done right, your site feels instant after
                the first visit. Done wrong, users get stale JS or a broken UI after a deploy.
            </Styled.Lead>

            {/* 1) Why cache control matters */}
            <Styled.Section>
                <Styled.H2>Why this matters (especially for React SPAs)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Fast loads:</b> caching static files (JS/CSS/fonts/images) avoids repeat downloads.
                    </li>
                    <li>
                        <b>Safe updates:</b> the HTML shell (<Styled.InlineCode>index.html</Styled.InlineCode>)
                        must refresh quickly so it can point to the latest hashed assets.
                    </li>
                    <li>
                        <b>CDN friendly:</b> correct headers let CDNs (Netlify/Vercel/CF Pages) serve from
                        edge caches globally.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core terms (plain English)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>HTTP cache:</b> A storage layer in the browser (and sometimes a CDN) that keeps copies of responses.
                    </li>
                    <li>
                        <b>Cache-Control:</b> The main header that sets caching rules. Example:
                        <Styled.InlineCode>Cache-Control: public, max-age=31536000, immutable</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>max-age=&lt;seconds&gt;:</b> How long the response is fresh. After this, the browser revalidates or refetches.
                    </li>
                    <li>
                        <b>public / private:</b> <i>public</i> allows shared caches (CDNs). <i>private</i> restricts caching to the user’s browser.
                    </li>
                    <li>
                        <b>immutable:</b> Tells the browser the file will never change during its lifetime. Great for fingerprinted files.
                    </li>
                    <li>
                        <b>no-store:</b> Never cache. Always fetch from the server (used for highly dynamic or sensitive responses).
                    </li>
                    <li>
                        <b>no-cache:</b> Allow storing, but revalidate before using (not the same as “don’t cache”).
                    </li>
                    <li>
                        <b>ETag:</b> A file “fingerprint” from the server. Browser asks “has it changed?”; server answers without resending the file if not.
                    </li>
                    <li>
                        <b>Last-Modified:</b> Timestamp of last change. Similar purpose to ETag, less precise.
                    </li>
                    <li>
                        <b>s-maxage:</b> Max age for shared caches (CDNs). Overrides <i>max-age</i> for the CDN layer only.
                    </li>
                    <li>
                        <b>stale-while-revalidate:</b> Serve the old file instantly, refresh it in the background for next time.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) The golden rule for React + Vite */}
            <Styled.Section>
                <Styled.H2>The golden rule for Vite/React builds</Styled.H2>
                <Styled.Pre>
                    {`// After "vite build", you get:
//   - /dist/index.html                    (HTML shell, changes often)
//   - /dist/assets/*.hash.js, *.hash.css  (fingerprinted assets, change rarely)

Rule of thumb:
- index.html        => Cache very briefly (or revalidate often)
- *.hash.js/*.css   => Cache for a year + immutable`}
                </Styled.Pre>
                <Styled.Small>
                    Vite puts a hash in asset filenames (<i>content fingerprinting</i>). When content changes,
                    the filename changes, so it’s safe to cache “forever”.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Practical recipes */}
            <Styled.Section>
                <Styled.H2>Recipes you can copy</Styled.H2>

                <Styled.H3>HTML shell (update quickly)</Styled.H3>
                <Styled.Pre>
                    {`Cache-Control: no-cache
ETag: "..."`}
                </Styled.Pre>
                <Styled.Small>
                    <b>no-cache</b> means the browser may keep a copy, but must revalidate before using it.
                    This ensures users pick up the latest asset references after you deploy.
                </Styled.Small>

                <Styled.H3>Hashed assets (cache forever)</Styled.H3>
                <Styled.Pre>
                    {`Cache-Control: public, max-age=31536000, immutable`}
                </Styled.Pre>
                <Styled.Small>
                    One year in seconds = <Styled.InlineCode>31536000</Styled.InlineCode>.{" "}
                    <b>immutable</b> tells the browser not to revalidate during that period.
                </Styled.Small>

                <Styled.H3>Images & fonts</Styled.H3>
                <Styled.Pre>
                    {`// If filenames are fingerprinted: treat like JS/CSS
Cache-Control: public, max-age=31536000, immutable

// If not fingerprinted (e.g., /logo.png):
Cache-Control: public, max-age=86400, must-revalidate   // 1 day, safer`}
                </Styled.Pre>

                <Styled.H3>SPA routing (React Router)</Styled.H3>
                <Styled.Pre>
                    {`// For unknown routes, serve index.html with no-cache:
Cache-Control: no-cache
// This ensures client-side router picks up new bundles after deploy.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Platform snippets */}
            <Styled.Section>
                <Styled.H2>Platform snippets</Styled.H2>

                <Styled.H3>Netlify — <code>_headers</code> file</Styled.H3>
                <Styled.Pre>
                    {`/*              // all paths: default safe base
  Cache-Control: public, max-age=0, must-revalidate

/index.html
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable`}
                </Styled.Pre>

                <Styled.H3>Vercel — <code>vercel.json</code></Styled.H3>
                <Styled.Pre>
                    {`{
  "headers": [
    {
      "source": "/index.html",
      "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(.*)\\.(js|css)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}`}
                </Styled.Pre>

                <Styled.H3>Cloudflare Pages — <code>_headers</code></Styled.H3>
                <Styled.Pre>
                    {`/*              
  Cache-Control: public, max-age=0, must-revalidate

/index.html
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable`}
                </Styled.Pre>

                <Styled.H3>GitHub Pages</Styled.H3>
                <Styled.List>
                    <li>
                        GH Pages sets conservative caching for HTML by default (good). For long-lived assets,
                        serve them under <Styled.InlineCode>/assets/</Styled.InlineCode> with hashed filenames (Vite default).
                    </li>
                    <li>
                        You don’t control headers directly, but hashed filenames still give you safe “forever cache”
                        because the URL changes on every build.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Advanced (optional but useful) */}
            <Styled.Section>
                <Styled.H2>Advanced options</Styled.H2>
                <Styled.List>
                    <li>
                        <b>stale-while-revalidate</b>: serve cached content instantly and refresh in background.
                        Example: <Styled.InlineCode>Cache-Control: public, max-age=600, stale-while-revalidate=86400</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>s-maxage</b> for CDNs: <Styled.InlineCode>Cache-Control: public, max-age=0, s-maxage=31536000</Styled.InlineCode>{" "}
                        (browser revalidates, CDN keeps it long).
                    </li>
                    <li>
                        <b>Service Worker vs HTTP cache:</b> A SW gives offline support and custom strategies
                        (Cache First, Network First). It’s additional to HTTP caching, not a replacement.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> cache <i>fingerprinted</i> assets for a year with <i>immutable</i>.</li>
                    <li><b>Do</b> use <i>no-cache</i> for <Styled.InlineCode>index.html</Styled.InlineCode> so deploys roll out instantly.</li>
                    <li><b>Do</b> keep images/fonts hashed if you want long caching without busting manually.</li>
                    <li><b>Don’t</b> set long caching on <i>non-fingerprinted</i> files (users may never see updates).</li>
                    <li><b>Don’t</b> assume <i>no-cache</i> means “don’t store” — it means “revalidate”. Use <i>no-store</i> to disable storing.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Fingerprinting:</b> Putting a content hash in the filename so changed content gets a new URL.</li>
                    <li><b>Revalidate:</b> Ask the server/CDN if the cached file is still fresh (using ETag/Last-Modified).</li>
                    <li><b>Shared cache:</b> A cache used by many users (e.g., CDN). Controlled via <i>public</i>/<i>s-maxage</i>.</li>
                    <li><b>Private cache:</b> A user’s browser cache. Controlled via <i>private</i>/<i>max-age</i>.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: cache the HTML shell briefly so users get the new build, and cache hashed assets
                for a year with <i>immutable</i>. That’s the safe, fast default for React + Vite on any host.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CacheControl;
