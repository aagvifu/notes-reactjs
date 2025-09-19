import React from "react";
import { Styled } from "./styled";

const CachingStrategies = () => {
    return (
        <Styled.Page>
            <Styled.Title>Caching Strategies (PWA)</Styled.Title>

            <Styled.Lead>
                A <b>caching strategy</b> is the rule your <b>Service Worker</b> uses to decide whether to
                respond from the <b>Cache Storage</b>, the <b>network</b>, or a combination of both. Good
                strategies make your app <i>fast</i>, <i>reliable</i>, and <i>work offline</i>.
            </Styled.Lead>

            {/* Key definitions */}
            <Styled.Section>
                <Styled.H2>Key Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Service Worker (SW):</b> a background script that can intercept <Styled.InlineCode>fetch</Styled.InlineCode> requests and serve custom responses, even when offline.
                    </li>
                    <li>
                        <b>Cache Storage:</b> browser storage for request/response pairs (different from HTTP cache). Managed with the <Styled.InlineCode>caches</Styled.InlineCode> API.
                    </li>
                    <li>
                        <b>Precache:</b> assets cached during SW <i>install</i> (e.g., app shell, critical CSS/JS).
                    </li>
                    <li>
                        <b>Runtime cache:</b> responses cached while the app runs (e.g., API GET, images).
                    </li>
                    <li>
                        <b>Strategy:</b> an algorithm deciding cache vs network (e.g., <i>Cache-First</i>, <i>Network-First</i>, <i>Stale-While-Revalidate</i>).
                    </li>
                    <li>
                        <b>TTL (time-to-live):</b> how long a cached response is considered fresh. (You implement TTL yourself or via libraries.)
                    </li>
                    <li>
                        <b>Opaque response:</b> a cross-origin response you can't inspect (status/headers hidden). Counts against quota and can't be validated.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* When to use what */}
            <Styled.Section>
                <Styled.H2>Choosing a Strategy (Quick Guide)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>HTML navigations (app shell):</b> <u>Network-First</u> with offline fallback (latest content when online; works offline).
                    </li>
                    <li>
                        <b>Static versioned assets (JS/CSS/fonts):</b> <u>Cache-First</u> (super fast; hashed filenames bust cache on deploy).
                    </li>
                    <li>
                        <b>API GET (news feed, products):</b> <u>Stale-While-Revalidate</u> or <u>Network-First</u> (balance freshness + speed).
                    </li>
                    <li>
                        <b>Images & icons:</b> <u>Cache-First</u> with expiration (limit size/entries).
                    </li>
                    <li>
                        <b>Mutations (POST/PUT/DELETE):</b> <u>Network-Only</u> (optionally queue via Background Sync).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Core strategies */}
            <Styled.Section>
                <Styled.H2>Core Strategies (with examples)</Styled.H2>

                <Styled.H3>1) Cache-First</Styled.H3>
                <Styled.Small>Serve from cache if present; otherwise go to network and cache it for next time. Great for immutable assets.</Styled.Small>
                <Styled.Pre>
                    {`self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    const cache = await caches.open("assets-v1");
    const cached = await cache.match(event.request);
    if (cached) return cached; // hit!

    const res = await fetch(event.request);
    // Optional: only cache successful, same-origin, GET responses
    if (res.ok && event.request.method === "GET" && new URL(event.request.url).origin === location.origin) {
      cache.put(event.request, res.clone());
    }
    return res;
  })());
});`}
                </Styled.Pre>

                <Styled.H3>2) Network-First</Styled.H3>
                <Styled.Small>Try network first for freshness; fall back to cache when offline/slow. Ideal for HTML pages and dynamic JSON.</Styled.Small>
                <Styled.Pre>
                    {`self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open("pages-v1");
      try {
        const fresh = await fetch(event.request);
        cache.put(event.request, fresh.clone());
        return fresh;
      } catch {
        const cached = await cache.match(event.request);
        return cached || await cache.match("/offline.html");
      }
    })());
  }
});`}
                </Styled.Pre>

                <Styled.H3>3) Stale-While-Revalidate (SWR)</Styled.H3>
                <Styled.Small>Serve cached response immediately (stale), then fetch in background and update cache for next time (revalidate). Great DX + perceived speed.</Styled.Small>
                <Styled.Pre>
                    {`self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith((async () => {
    const cache = await caches.open("api-swr-v1");
    const cached = await cache.match(event.request);
    const networkPromise = fetch(event.request)
      .then((res) => {
        if (res && res.ok) cache.put(event.request, res.clone());
        return res;
      })
      .catch(() => null);

    // Return cached immediately if exists; else wait for network.
    return cached || (await networkPromise) || new Response("Offline", { status: 503 });
  })());
});`}
                </Styled.Pre>

                <Styled.H3>4) Network-Only / Cache-Only</Styled.H3>
                <Styled.Small><b>Network-Only:</b> always use network (e.g., POST). <b>Cache-Only:</b> debug/special flows when you want to guarantee offline.</Styled.Small>
                <Styled.Pre>
                    {`// Network-Only: do nothing (default browser behavior)
// Cache-Only: useful for special routes
self.addEventListener("fetch", (event) => {
  if (new URL(event.request.url).pathname.startsWith("/static-snapshot/")) {
    event.respondWith(caches.match(event.request));
  }
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* Precache + versioning */}
            <Styled.Section>
                <Styled.H2>Precache & Versioning</Styled.H2>
                <Styled.Small>Precache critical files during <code>install</code>, and clean old caches during <code>activate</code>. Use versioned cache names or hashed filenames.</Styled.Small>
                <Styled.Pre>
                    {`const PRECACHE = "precache-v3";
const RUNTIME = "runtime-v3";
const PRECACHE_URLS = ["/", "/index.html", "/offline.html", "/assets/app.abc123.js", "/assets/styles.def456.css"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PRECACHE).then((c) => c.addAll(PRECACHE_URLS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((n) => (n !== PRECACHE && n !== RUNTIME) ? caches.delete(n) : null));
    self.clients.claim();
  })());
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* Expiration & quotas */}
            <Styled.Section>
                <Styled.H2>Expiration, Size Limits & Quotas</Styled.H2>
                <Styled.List>
                    <li>
                        Browsers enforce storage quotas. Periodically delete old entries or limit cache entries (e.g., keep last 100 images).
                    </li>
                    <li>
                        Implement simple expiration by storing metadata (timestamp) in <Styled.InlineCode>IndexedDB</Styled.InlineCode> or using a library that supports expiration.
                    </li>
                    <li>
                        <b>Opaque responses</b> (e.g., CDNs with <Styled.InlineCode>no-cors</Styled.InlineCode>) can't be validated and still consume space—cache carefully.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example: basic "max entries" eviction for an image cache
async function enforceMaxEntries(cacheName, max = 100) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= max) return;
  // delete oldest first (keys are in insertion order in most browsers)
  await cache.delete(keys[0]);
}

// After put():
// await enforceMaxEntries("images-v1", 100);`}
                </Styled.Pre>
            </Styled.Section>

            {/* Offline fallback */}
            <Styled.Section>
                <Styled.H2>Offline Fallbacks</Styled.H2>
                <Styled.Small>Provide a default response when the network is unavailable and nothing is cached.</Styled.Small>
                <Styled.Pre>
                    {`self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      try { return await fetch(event.request); }
      catch {
        const cache = await caches.open("pages-v1");
        return (await cache.match("/offline.html")) || new Response("You are offline.", { status: 503 });
      }
    })());
  }
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* Workbox mention */}
            <Styled.Section>
                <Styled.H2>Using a Library (Workbox)</Styled.H2>
                <Styled.Small>Workbox provides batteries-included strategies like CacheFirst, NetworkFirst, StaleWhileRevalidate, plus plugins for expiration and routing.</Styled.Small>
                <Styled.Pre>
                    {`// workbox-sw.js must be available; then in your service worker:
workbox.routing.registerRoute(
  ({request}) => request.destination === "script" || request.destination === "style",
  new workbox.strategies.CacheFirst({ cacheName: "assets-v1" })
);

workbox.routing.registerRoute(
  ({url}) => url.pathname.startsWith("/api/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "api-swr-v1",
    plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 10 })] // 10 min
  })
);`}
                </Styled.Pre>
            </Styled.Section>

            {/* Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> precache your app shell and use hashed filenames for assets.</li>
                    <li><b>Do</b> prefer SWR for user-facing lists (fast + self-healing freshness).</li>
                    <li><b>Do</b> add an offline fallback page and image placeholder.</li>
                    <li><b>Don't</b> cache POST/PUT/DELETE responses blindly; queue them for retry instead.</li>
                    <li><b>Don't</b> cache sensitive endpoints (auth tokens, personal data) without strong justification.</li>
                    <li><b>Don't</b> forget to clean old cache versions in <Styled.InlineCode>activate</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* Debugging & testing */}
            <Styled.Section>
                <Styled.H2>Debugging & Testing</Styled.H2>
                <Styled.List>
                    <li>
                        Use DevTools → <i>Application</i> tab to inspect <i>Service Workers</i> and <i>Cache Storage</i>.
                    </li>
                    <li>
                        Simulate <i>Offline</i> in DevTools → Network; verify fallbacks and cache hits.
                    </li>
                    <li>
                        Run Lighthouse (PWA audits) to validate offline readiness and manifest.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>App shell:</b> minimal HTML/CSS/JS needed to render the UI chrome.</li>
                    <li><b>Background Sync:</b> API to retry network operations later when connectivity returns.</li>
                    <li><b>Navigation fallback:</b> default HTML served for navigations when offline.</li>
                    <li><b>Revisioned assets:</b> files named with content hashes (e.g., <Styled.InlineCode>app.abc123.js</Styled.InlineCode>) to bust caches on deploy.</li>
                    <li><b>Strategy plugins:</b> helpers that add expiration, cacheable response filtering, etc. (often via Workbox).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: pick strategies per resource type—Cache-First for immutable assets, SWR or Network-First for data and pages,
                and always ship an offline fallback. Version caches, expire entries, and test with DevTools + Lighthouse.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CachingStrategies;
