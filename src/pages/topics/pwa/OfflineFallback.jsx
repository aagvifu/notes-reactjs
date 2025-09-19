import React from "react";
import { Styled } from "./styled";

const OfflineFallback = () => {
    return (
        <Styled.Page>
            <Styled.Title>PWA — Offline Fallback</Styled.Title>

            <Styled.Lead>
                <b>Offline fallback</b> means your app returns a friendly page when the network is unavailable,
                instead of showing a generic browser error. PWAs implement this using a <b>Service Worker</b> to
                intercept requests and serve a cached <b>fallback document</b> (usually an HTML page) or a
                <b>placeholder asset</b> (image, font) when the network can't be reached.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Progressive Web App (PWA):</b> A web app that uses modern capabilities (Service Worker,
                        HTTPS, App Manifest) to deliver app-like reliability, installability, and performance.
                    </li>
                    <li>
                        <b>Service Worker (SW):</b> A background script that sits between your app and the network.
                        It can intercept <Styled.InlineCode>fetch</Styled.InlineCode> requests and decide what to return
                        (cache / network / fallback). Runs off the main thread and persists across page reloads.
                    </li>
                    <li>
                        <b>Cache Storage API:</b> An origin-scoped storage for HTTP responses (separate from the
                        browser's HTTP cache). You control what to add/remove and what to serve when offline.
                    </li>
                    <li>
                        <b>Offline fallback (navigation):</b> For top-level navigations (URL bar, link clicks) when
                        the real HTML can't be fetched, return a cached <em>offline.html</em>.
                    </li>
                    <li>
                        <b>Offline fallback (assets):</b> For images/fonts/etc. return a lightweight placeholder if
                        the original asset isn't cached and network fails.
                    </li>
                    <li>
                        <b>App Shell:</b> Minimal HTML/CSS/JS required to load the UI frame instantly. Often precached
                        so the shell loads offline, then content hydrates when online.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal flow */}
            <Styled.Section>
                <Styled.H2>How Offline Fallback Works (Minimal Flow)</Styled.H2>
                <Styled.List>
                    <li>During <b>install</b>, the SW precaches an <Styled.InlineCode>offline.html</Styled.InlineCode> page.</li>
                    <li>During a <b>fetch</b> for a <i>navigation request</i>, the SW tries the network first.</li>
                    <li>If network fails, the SW <b>responds with the cached offline page</b>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// service-worker.js (conceptual example)
// Version your cache to manage updates
const CACHE_NAME = "app-cache-v1";
const OFFLINE_URL = "/offline.html";

// Install: open cache and add fallback document + minimal assets
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([OFFLINE_URL]); // you can add CSS/fonts used by offline.html
  })());
  self.skipWaiting(); // activate immediately on first load (optional)
});

// Activate: cleanup old caches if you rotate versions
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : undefined)));
  })());
  self.clients.claim();
});

// Fetch: provide an offline fallback for navigations
self.addEventListener("fetch", (event) => {
  const { request } = event;
  // A "navigation request" is when the browser is requesting a page (HTML)
  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    event.respondWith((async () => {
      try {
        // Try the network first for fresh content
        const networkResponse = await fetch(request);
        return networkResponse;
      } catch (err) {
        // If network fails, return the offline page from cache
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(OFFLINE_URL);
        return cached || new Response("Offline", { status: 503, statusText: "Offline" });
      }
    })());
  }
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Navigation request:</b> A top-level document request (not an image or XHR). In SW, detect via{" "}
                    <Styled.InlineCode>request.mode === "navigate"</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Creating a good offline page */}
            <Styled.Section>
                <Styled.H2>Designing a Helpful Offline Page</Styled.H2>
                <Styled.List>
                    <li>
                        Keep it <b>small</b> (fast to cache & serve). Inline minimal CSS. Offer a clear message like
                        “You're offline — some features may be unavailable.”
                    </li>
                    <li>
                        Include <b>basic navigation</b> back to the home route and to pages you know are cached.
                    </li>
                    <li>
                        Optionally, show <b>cached content</b> (from IndexedDB) if your app stores recent data.
                    </li>
                    <li>
                        Offer a <b>retry</b> button that attempts to reload when the network returns.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<!-- public/offline.html (keep dependencies minimal) -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Offline — YourApp</title>
    <style>
      body { font: 16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; padding: 24px; }
      .card { max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #ccc; border-radius: 12px; }
      h1 { margin-top: 0; }
      button { padding: 8px 14px; border-radius: 8px; border: 1px solid #bbb; cursor: pointer; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>You're offline</h1>
      <p>Some pages and features may be unavailable. Try again when you're back online.</p>
      <p><a href="/">Go to Home</a></p>
      <button onclick="location.reload()">Retry</button>
    </main>
  </body>
</html>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Asset fallbacks */}
            <Styled.Section>
                <Styled.H2>Asset Fallbacks (Images, Fonts, etc.)</Styled.H2>
                <Styled.List>
                    <li>
                        For non-navigation requests (e.g., images), you can return a <b>placeholder</b> image when
                        network + cache both miss.
                    </li>
                    <li>
                        Use a separate <b>runtime caching</b> strategy for assets: Cache-First (if you want speed) or
                        Stale-While-Revalidate (if you want freshness).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// In the same service-worker.js
const PLACEHOLDER_IMG_URL = "/img/placeholder.png";

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Example: provide a placeholder for images if fetch fails
  if (request.destination === "image") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      // Try cache, then network, then placeholder
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const resp = await fetch(request);
        // Optionally: put a copy into cache for future offline use
        cache.put(request, resp.clone());
        return resp;
      } catch {
        // Last resort: placeholder
        const ph = await cache.match(PLACEHOLDER_IMG_URL);
        return ph || new Response("", { status: 404 });
      }
    })());
  }
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Runtime caching:</b> Caching responses as the app runs (on demand) vs. <b>precache</b> during SW install.
                </Styled.Small>
            </Styled.Section>

            {/* 5) What to do & avoid */}
            <Styled.Section>
                <Styled.H2>Do / Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> precache <Styled.InlineCode>offline.html</Styled.InlineCode> and any minimal CSS it needs.</li>
                    <li><b>Do</b> return the offline page specifically for <b>navigation requests</b>.</li>
                    <li><b>Do</b> keep the offline page independent of large JS bundles.</li>
                    <li><b>Don't</b> rely solely on the browser's HTTP cache—use <b>Cache Storage API</b> to control fallbacks.</li>
                    <li><b>Don't</b> cache POST responses or sensitive/auth-only content without a strategy.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Related concepts */}
            <Styled.Section>
                <Styled.H2>Related Concepts (Quick Glossary)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>App Manifest:</b> A <Styled.InlineCode>manifest.webmanifest</Styled.InlineCode> JSON file describing
                        your app's name, icons, theme colors, and start URL. Required for “Install app.”
                    </li>
                    <li>
                        <b>Caching Strategy:</b> A policy for how to answer requests (Network-First, Cache-First,
                        Stale-While-Revalidate, etc.). Offline fallback typically pairs with Network-First for navigations.
                    </li>
                    <li>
                        <b>Install / Activate events:</b> SW lifecycle events where you precache and clean old caches.
                    </li>
                    <li>
                        <b>Navigation Preload:</b> A feature to start network fetch in parallel while the SW spins up,
                        reducing latency (enable via <Styled.InlineCode>self.registration.navigationPreload.enable()</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Testing checklist */}
            <Styled.Section>
                <Styled.H2>Testing Your Offline Fallback</Styled.H2>
                <Styled.List>
                    <li>Open DevTools → <b>Application</b> → Service Workers: check “Offline”.</li>
                    <li>Hard refresh your app and navigate between routes; verify the offline page appears for new navigations.</li>
                    <li>Switch DevTools Network to “Offline” and reload — ensure offline.html is served.</li>
                    <li>Clear site data, reinstall SW, and repeat.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> Precache an <i>offline.html</i> page during SW install. On navigation fetches, try
                network and fall back to the cached offline page. For assets, provide placeholders when both cache
                and network miss. Keep fallbacks tiny, helpful, and independent of your main bundle.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default OfflineFallback;
